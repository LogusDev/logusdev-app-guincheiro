import { View, Text, StatusBar, ScrollView, Alert } from "react-native";
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

  const fetchTowCars = async () => {
    try {
      const response = await getGuinchosByGuincheiro(driver.id, driver.token);
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
    }
  };

  useEffect(() => {
    if (driver?.id) {
      fetchTowCars();
    }
  }, [driver]);

  useEffect(() => {
  if (towCars.length > 0) {
    const activeVehicle = towCars.find(v => v.ativo === true);
    if (activeVehicle) {
      setselectedTowCar(activeVehicle.id);
    }
  }
}, [towCars]);


  const handleSelectedTowCar = async (vehicleId) => {
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
            const formattedVehicle = {
              ...updatedVehicle,
              placa: updatedVehicle.placa.replace(/[^a-zA-Z0-9]/g, "").toUpperCase(),
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
