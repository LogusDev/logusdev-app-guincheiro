import { View, Text, StatusBar, ScrollView, Alert, ActivityIndicator } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import TowCarCard from "../../components/TowCarCard";
import styles from "./styles";
import AddButton from "../../components/AddButton";
import { getGuinchosByGuincheiro, updateGuincho } from "../../services/services";
import { DriverContext } from "../../contexts/DriverContext";
import api from "../../services/api";
import TowCarEditModal from "../TowCarEditModal";
import TowCarAddModal from "../TowCarAddModal";

export default function TowCarSelection() {
  const { driver } = useContext(DriverContext);
  const [towCars, settowCars] = useState([]);
  const [selectedTowCar, setselectedTowCar] = useState(null);
  const [isTowCarEditModalVisible, setTowCarEditModalVisible] = useState(false);
  const [isTowCarAddModalVisible, setTowCarAddModalVisible] = useState(false);
  const [towcarEdit, settowcarEdit] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTowCars = async () => {
    try {
      if (!driver?.id) {
        console.warn("Driver ID não disponível");
        setLoading(false);
        return;
      }
      
      setLoading(true);
      const response = await getGuinchosByGuincheiro(driver.id);
      console.log("Tipo:", typeof response);
      console.log("É array?", Array.isArray(response));
      console.log("Valor:", response);

      let towCarsArray = [];

      if (Array.isArray(response)) {
        towCarsArray = response;
      } else if (response && response.data && Array.isArray(response.data)) {
        towCarsArray = response.data;
      } else if (response && response.towCars && Array.isArray(response.towCars)) {
        towCarsArray = response.towCars;
      } else if (response && typeof response === "object") {
        towCarsArray = [response];
      }

      console.log("Guinchos final:", towCarsArray);
      settowCars(towCarsArray);
    } catch (error) {
      console.error("Erro ao buscar veículos:", error);
      settowCars([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (driver?.id) {
      fetchTowCars();
    }
  }, [driver?.id]); // Usar driver?.id para evitar re-renders desnecessários

  useEffect(() => {
  if (towCars.length > 0) {
    const activeVehicle = towCars.find(v => v.ativo === true);
    if (activeVehicle) {
      setselectedTowCar(activeVehicle.id);
    }
  }
}, [towCars]);


  const handleSelectedTowCar = async (vehicleId) => {
    if (!driver?.id) {
      Alert.alert("Erro", "Dados do guincheiro não disponíveis.");
      return;
    }
    
    try {
      await api.put(
        `/guinchos/${vehicleId}/selecionar`,
        { guincheiro_id: driver.id }
      );

      setselectedTowCar(vehicleId);
      fetchTowCars();

    } catch (error) {
      console.log("Erro ao selecionar veículo", error);
      Alert.alert("Erro", "Não foi possível selecionar o veículo.");
    }
  };

const handleEditTowCar = (vehicle) => {
  settowcarEdit(vehicle);
  setTowCarEditModalVisible(true);
};

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#FFFFFF" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1F284E" />
          <Text style={styles.loadingText}>Carregando guinchos...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <Text style={styles.title}>Guinchos ({towCars.length})</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {towCars.map((vehicle, index) => (
          <View key={vehicle.id || index}>
            <TowCarCard
              guincho={vehicle}
              active={selectedTowCar === vehicle.id}
              onSelect={() => handleSelectedTowCar(vehicle.id)}
              onEdit={() => handleEditTowCar(vehicle)}
            />
            <View style={styles.separatorLine} />
          </View>
        ))}

        <AddButton onPress={() => setTowCarAddModalVisible(true)} />

        {towCars.length === 0 && (
          <Text style={styles.notowCars}>Nenhum guincho cadastrado</Text>
        )}
      </ScrollView>

      <TowCarEditModal
        visible={isTowCarEditModalVisible}
        onClose={() => setTowCarEditModalVisible(false)}
        guincho={towcarEdit}
        onSave={async (updatedVehicle) => {
          try {
            if (!driver?.id || !updatedVehicle?.id) {
              console.warn("Dados incompletos para atualização");
              return;
            }
            
            const formattedVehicle = {
              ...updatedVehicle,
              placa: updatedVehicle.placa?.replace(/[^a-zA-Z0-9]/g, "")?.toUpperCase() || updatedVehicle.placa,
              guincheiro_id: driver.id,
            };

            const updated = await updateGuincho(formattedVehicle.id, formattedVehicle);
            await fetchTowCars();

            settowCars((prevtowCars) =>
              prevtowCars.map((v) => (v.id === updated.id ? updated : v))
            );
          } catch (error) {
            console.log("Erro ao atualizar veículo", error);
          } finally {
            setTowCarEditModalVisible(false);
          }
        }}
      />

      <TowCarAddModal
        visible={isTowCarAddModalVisible}
        onClose={() => setTowCarAddModalVisible(false)}
        onSave={(newVehicle) => {
        settowCars((prevtowCars) => [...prevtowCars, newVehicle]);
        setTowCarAddModalVisible(false);
        }}
      />
    </View>
  );
}
