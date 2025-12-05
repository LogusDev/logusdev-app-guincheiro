import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';

export default function ActivityCard({ activity }) {
  const navigation = useNavigation();

  console.log("Dados", activity)

  const startTime = new Date(activity.requisitado_em).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const endTime = activity.completado_em
    ? new Date(activity.completado_em).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "--:--";

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.card}
        onPress={() =>
          navigation.navigate("ReceiptScreen", {
            receiptData: activity,
          })
        }
      >
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Image
              source={
                activity.cliente?.foto_url
                  ? { uri: activity.cliente.foto_url }
                  : require("../../assets/images/userImage.png")
              }
              style={styles.avatar}
            />
            <Text style={styles.user}>
              {activity.cliente?.nome || "Nome não encontrado"}
            </Text>
          </View>

          <View style={styles.timeBox}>
            <Text style={styles.time}>{startTime}</Text>
            <Ionicons
              name="timer-outline"
              size={16}
              color="#888"
              style={{ marginHorizontal: 2 }}
            />

            <Text style={styles.time}>{endTime}</Text>
          </View>
        </View>

        <View style={styles.addressContainer}>
          <Text style={styles.address} numberOfLines={2}>
            {activity.endereco_inicial || activity.latitude_inicial}
          </Text>
          <View style={styles.divider} />
          <Text style={styles.address} numberOfLines={2}>
            {activity.endereco_final || activity.latitude_final}
          </Text>
        </View>
      </TouchableOpacity>
      <View style={styles.separator} />
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#F5f5f5",
    borderRadius: 10,
    padding: 16,
    marginVertical: 10,
    marginBottom: 40,
    width: "100%",
    elevation: 2,
    borderWidth: 1,
    borderColor: "#1F284E",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    borderWidth: 2,
    borderColor: "#1F284E",
  },
  user: {
    color: "#1F284E",
    fontSize: 18,
    fontWeight: "700",
  },
  timeBox: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  time: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
    marginHorizontal: 4,
  },
  addressContainer: {
    width: "70%",
    margin: "auto",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#1F284E",
    padding: 6,
    borderRadius: 6,
  },
  address: {
    flex: 1,
    fontSize: 13,
    color: "#2C2C2C",
    marginHorizontal: 4,
    textAlign: "center",
  },
  divider: {
    width: 1,
    backgroundColor: "#D0D0D0",
  },
  separator: {
    height: 1,
    backgroundColor: "#C0C0C0",
    marginVertical: 8,
  },
});
