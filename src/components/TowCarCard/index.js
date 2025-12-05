import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import TowCar from '../../assets/images/towCar-icon.png';

export default function TowCarCard({ guincho, active, onSelect, onEdit }) {
  const { modelo, ano_fabricacao, marca, placa, capacidade, comprimento_plataforma } = guincho || {};

  const formattedLicensePlate = (placa) => {
    if (!placa) return 'Não informada';
    const clean = placa.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    if (clean.length > 3) return clean.slice(0, 3) + "-" + clean.slice(3);
    return clean;
  };

  return (
    <TouchableOpacity
      style={[styles.cardContainer, active && { borderColor: '#1F284E' }]}
      onPress={onSelect}
      activeOpacity={0.8}
    >
      
      {active && (
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>Atual</Text>
        </View>
      )}

      <View style={styles.textContainer}>
        <Text style={styles.name}>{modelo ? modelo.split(" ")[0] : "Modelo"}</Text>
        <Text style={styles.yearBrand}>{ano_fabricacao} - {marca}</Text>
      </View>

      <TouchableOpacity style={styles.editButton} onPress={onEdit}>
        <Ionicons name="create-outline" size={20} color="#1F284E" />
      </TouchableOpacity>

      <Image source={TowCar} style={styles.towCarImg} />

      <View style={styles.infoRight}>
        <Text style={styles.placa}>Placa: {formattedLicensePlate(placa)}</Text>

        <Text style={styles.specs}>
          Capacidade: {capacidade ? `${capacidade} kg` : "Não informado"}
        </Text>

        <Text style={styles.specs}>
          Plataforma: {comprimento_plataforma ? `${comprimento_plataforma} m` : "Não informado"}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#FFFFFF",
    width: "90%",
    height: 170,
    alignSelf: "center",
    borderRadius: 16,
    borderColor: "#BEBEBE",
    borderWidth: 5,
    marginTop: 30,
    elevation: 5,
    position: "relative",
  },

  editButton: {
    position: "absolute",
    left: 10,
    top: "60%",
    backgroundColor: "#FFF",
    width: 40,
    height: 40,
    borderWidth: 1,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },

  textContainer: {
    position: "absolute",
    top: 12,
    left: 12,
  },

  name: {
    fontSize: 18,
    color: "#1F284E",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },

  yearBrand: {
    marginTop: 2,
    fontSize: 13,
    color: "#1F284E",
  },

  towCarImg: {
    width: 135,
    height: 135,
    position: "absolute",
    left: "30%",
    top: 18,
    resizeMode: "contain",
     transform: [{ scaleX: -1 }],
  },

  infoRight: {
    position: "absolute",
    top: "58%",
    right: 10,
    alignItems: "flex-end",
  },

  placa: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#1F284E",
  },

  specs: {
    fontSize: 12,
    color: "#1F284E",
    marginTop: 3,
  },

  badgeContainer: {
    position: "absolute",
    top: -12,
    right: 12,
    backgroundColor: "#1F284E",
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 12,
  },

  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontStyle: "italic",
  },
});
