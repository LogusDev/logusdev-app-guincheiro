import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Image } from "expo-image";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { Ionicons } from "@expo/vector-icons";
import { useRef, useState, useEffect } from "react";
import * as Location from "expo-location";
import { LocationAccuracy } from "expo-location";
import styles from "./styles";
import IconOrigem from "../../components/IconOrigem";
import { getCallDetails } from "../../services/calls";
import Hatch from "../../assets/images/carhatch.svg";
import { StatusBar } from "expo-status-bar";

const GOOGLE_MAPS_APIKEY = "AIzaSyBS5TYszHyw5VyTUU9gUCWYdNqOQ5pt7ik";

export default function DetalheChamado({ route }) {
  const { chamado } = route.params;

  const [detalhe, setDetalhe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posicaoGuincheiro, setPosicaoGuincheiro] = useState(null);

  const mapRef = useRef(null);

  // BUSCA DETALHES
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

  // LOCALIZAÇÃO
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

  // AJUSTA O MAPA
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

      mapRef.current.fitToCoordinates([posicaoGuincheiro, origem, destino], {
        edgePadding: { top: 120, right: 80, bottom: 420, left: 80 },
        animated: true,
      });
    }
  }, [posicaoGuincheiro, detalhe]);

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

      {/* CARD FIXO NA PARTE DE BAIXO */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: 30,
          backgroundColor: "#fff",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
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
            <View className={styles.addressRow}>
              <IconOrigem width={20} height={20} />
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={styles.addressTitle}>
                  {detalhe.endereco_inicio?.split(",")[0]}
                </Text>
                <Text style={styles.addressText}>
                  {detalhe.endereco_inicio}
                </Text>
              </View>
            </View>

            <View style={styles.dottedLineContainer}>
              <View style={styles.dottedLine} />
            </View>

            <View style={styles.addressRow}>
              <Ionicons name="location" size={20} color="#FFB100" />
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={styles.addressTitle}>
                  {detalhe.endereco_destino?.split(",")[0]}
                </Text>
                <Text style={styles.addressText}>
                  {detalhe.endereco_destino}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.carRow}>
            <Hatch width={24} height={24} style={{ marginRight: 8 }} />
            <Text style={styles.carInfo}>
              <Text style={{ fontWeight: "bold" }}>
                {detalhe.carro?.modelo}
              </Text>{" "}
              {detalhe.carro?.ano} / ***{detalhe.carro?.placa?.slice(-4)}
            </Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Valor:</Text>
            <Text style={styles.priceValue}>
              R$ {Number(detalhe.preco).toFixed(2).replace(".", ",")}
            </Text>

            <View style={{ flex: 1 }} />

            <Ionicons name="card" size={22} color="#1F284E" />
            <Text style={styles.payment}>
              {detalhe.metodo_pagamento?.toUpperCase() || "CARTÃO"}
            </Text>
          </View>

          <TouchableOpacity style={styles.confirmButton}>
            <Text style={styles.confirmText}>Confirmar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
