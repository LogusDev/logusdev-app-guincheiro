import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { Image } from "expo-image";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { Ionicons } from "@expo/vector-icons";
import { useRef, useState, useEffect, useContext } from "react";
import * as Location from "expo-location";
import { LocationAccuracy } from "expo-location";
import styles from "./styles";
import IconOrigem from "../../components/IconOrigem";
import { getCallDetails, confirmCall, refuseCall } from "../../services/calls";
import Hatch from "../../assets/images/carhatch.svg";
import { StatusBar } from "expo-status-bar";
import { DriverContext } from "../../contexts/DriverContext";
import Button from "../../components/Button";

const GOOGLE_MAPS_APIKEY = "AIzaSyBkx6mo29bFuoPzoNSLpE97c8EoWptHl1M";

export default function DetalheChamado({ route, navigation }) {
  const { chamado } = route.params;
  const {driver} = useContext(DriverContext);


  const [detalhe, setDetalhe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posicaoGuincheiro, setPosicaoGuincheiro] = useState(null);

  const mapRef = useRef(null);

  console.log(driver.id);
  // BUSCA OS DETALHES DO CHAMADO
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await getCallDetails(chamado.id);
        setDetalhe(data);
      } catch (error) {
        console.error("Erro ao carregar detalhes do chamado:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [chamado.id]);

  // LOCALIZAÇÃO DO GUINCHEIRO
  useEffect(() => {
    let watcher = null;

    const requestLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permissão de localização negada");
        return;
      }

      const current = await Location.getCurrentPositionAsync({});
      setPosicaoGuincheiro(current.coords);

      watcher = await Location.watchPositionAsync(
        {
          accuracy: LocationAccuracy.Highest,
          timeInterval: 2000,
          distanceInterval: 5,
        },
        (location) => setPosicaoGuincheiro(location.coords)
      );
    };

    requestLocationPermission();

    return () => watcher && watcher.remove();
  }, []);

  // AJUSTE DO MAPA (corrigido)
  useEffect(() => {
    if (mapRef.current && detalhe && posicaoGuincheiro) {
      const origem = {
        latitude: Number(detalhe.coordenadas_inicio.latitude),
        longitude: Number(detalhe.coordenadas_inicio.longitude),
      };
      const destino = {
        latitude: Number(detalhe.coordenadas_destino.latitude),
        longitude: Number(detalhe.coordenadas_destino.longitude),
      };

      mapRef.current.fitToCoordinates(
        [posicaoGuincheiro, origem, destino],
        {
          edgePadding: { top: 120, right: 80, bottom: 180, left: 80 }, // AJUSTADO AQUI
          animated: true,
        }
      );
    }
  }, [posicaoGuincheiro, detalhe]);

  const handleCallConfirm = async () => {
      try {
        const response = await confirmCall(chamado.id, driver.id);
        console.log('Chamado confirmado:', response);
        navigation.navigate('CallProgress', { chamado: response });
      }
      catch (error) {
        console.error('Erro ao confirmar o chamado:', error);
        Alert.alert('Erro', 'Não foi possível aceitar o chamado. Tente novamente.');
      }
  }

  const handleCallRefuse = async () => {
    Alert.alert(
      'Recusar Chamado',
      'Tem certeza que deseja recusar este chamado?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Recusar',
          style: 'destructive',
          onPress: async () => {
            try {
              await refuseCall(chamado.id, driver.id);
              console.log('Chamado recusado');
              navigation.goBack();
            }
            catch (error) {
              console.error('Erro ao recusar o chamado:', error);
              Alert.alert('Erro', 'Não foi possível recusar o chamado. Tente novamente.');
            }
          }
        }
      ]
    );
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#1F284E" />
      </View>
    );
  }

  if (!detalhe) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Erro ao carregar os detalhes do chamado.</Text>
      </View>
    );
  }

  const origem = {
    latitude: Number(detalhe.coordenadas_inicio.latitude),
    longitude: Number(detalhe.coordenadas_inicio.longitude),
  };
  const destino = {
    latitude: Number(detalhe.coordenadas_destino.latitude),
    longitude: Number(detalhe.coordenadas_destino.longitude),
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      {/* MAPA */}
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={{
          latitude: origem.latitude,
          longitude: origem.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {posicaoGuincheiro && (
          <Marker coordinate={posicaoGuincheiro} title="Guincheiro">
            <Ionicons name="car-sport" size={30} color="#3498DB" />
          </Marker>
        )}

        <Marker coordinate={origem} title="Cliente">
          <IconOrigem width={30} height={30} />
        </Marker>

        <Marker coordinate={destino} title="Destino">
          <Ionicons name="flag" size={30} color="#E53935" />
        </Marker>

        {posicaoGuincheiro && (
          <MapViewDirections
            origin={posicaoGuincheiro}
            destination={origem}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={4}
            strokeColor="#3498DB"
          />
        )}

        <MapViewDirections
          origin={origem}
          destination={destino}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeWidth={5}
          strokeColor="#1F284E"
        />
      </MapView>

      {/* CARD INFERIOR */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "#fff",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Solicitando Guincho:</Text>

          <View style={styles.profileRow}>
            <Image
              source={
                chamado.cliente_foto_url
                  ? { uri: chamado.cliente_foto_url }
                  : require("../../assets/images/profileIcon.png")
              }
              style={styles.avatar}
            />
            <Text style={styles.nome}>{chamado.cliente_nome}</Text>
          </View>

          <View style={styles.addressBox}>
            <View style={styles.addressRow}>
              <View style={styles.iconContainer}>
                <IconOrigem width={22} height={22} />
              </View>
              <View style={styles.addressContent}>
                <Text style={styles.addressTitle}>
                  {detalhe.endereco_inicio?.split(",")[0]}
                </Text>
                <Text style={styles.addressText} numberOfLines={1} ellipsizeMode="tail">
                  {detalhe.endereco_inicio}
                </Text>
              </View>
            </View>

            <View style={styles.dottedLineContainer}>
              <View style={styles.dottedLine}>
                <View style={styles.dottedDot} />
                <View style={styles.dottedDot} />
                <View style={styles.dottedDot} />
              </View>
            </View>

            <View style={styles.addressRow}>
              <View style={styles.iconContainer}>
                <Ionicons name="location" size={22} color="#FFB100" />
              </View>
              <View style={styles.addressContent}>
                <Text style={styles.addressTitle}>
                  {detalhe.endereco_destino?.split(",")[0]}
                </Text>
                <Text style={styles.addressText} numberOfLines={1} ellipsizeMode="tail">
                  {detalhe.endereco_destino}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.carRow}>
            <View style={styles.carIconContainer}>
              <Hatch width={60} height={60} />
            </View>
            <View style={styles.carInfoContainer}>
              <Text style={styles.carModel}>
                {detalhe.carro?.modelo}
              </Text>
              <Text style={styles.carDetails}>
                {detalhe.carro?.marca || "Renault"} {detalhe.carro?.ano} / ***{detalhe.carro?.placa?.slice(-4)}
              </Text>
            </View>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Valor:</Text>
            <Text style={styles.priceValue}>
              R$:{Number(detalhe.preco).toFixed(2).replace(".", ",")}
            </Text>

            <View style={{ flex: 1 }} />

            <Ionicons name="card" size={22} color="#1F284E" />
            <Text style={styles.payment}>
              {detalhe.metodo_pagamento?.toUpperCase() || "CARTÃO"}
            </Text>
          </View>
          <View style={{flexDirection: 'row', gap: 10, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, marginTop: 20}}>
            <TouchableOpacity
              style={[styles.refuseButton, { flex: 1 }]}
              onPress={handleCallRefuse}
            >
              <Text style={styles.refuseButtonText}>Recusar</Text>
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Button
                text="Confirmar"
                onPress={handleCallConfirm}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
