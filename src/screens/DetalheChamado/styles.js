import { StyleSheet } from "react-native";

export default StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 26,
    paddingTop: 24,
    paddingBottom: 34,
    elevation: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -4 },
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#000",
    marginBottom: 16,
    textAlign: "center",
  },

  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 12,
  },
  nome: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F284E",
  },

  // Endereços
  addressBox: {
    marginBottom: 20,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  addressTitle: {
    fontSize: 16,
    color: "#1F284E",
    fontWeight: "bold",
  },
  addressText: {
    fontSize: 14,
    color: "#6C6C6C",
    marginTop: 2,
  },

  dottedLineContainer: {
    height: 28,
    width: 20,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: -4,
    marginLeft: 8,
  },
  dottedLine: {
    height: "100%",
    width: 1,
    borderLeftWidth: 2,
    borderStyle: "dotted",
    borderColor: "#C0C0C0",
  },

  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 14,
  },

  // Carro
  carRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    marginTop: 12,
  },
  carImage: {
    width: 55,
    height: 28,
    marginRight: 10,
  },
  carInfo: {
    fontSize: 16,
    color: "#1F284E",
  },

  // Valor e pagamento
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  priceLabel: {
    fontSize: 18,
    color: "#1F284E",
    fontWeight: "700",
  },
  priceValue: {
    fontSize: 18,
    color: "#20B26A",
    fontWeight: "700",
  },
  payment: {
    fontSize: 16,
    color: "#1F284E",
    fontWeight: "600",
    marginLeft: 8,
  },

  // Botão Confirmar
  confirmButton: {
    backgroundColor: "#1F284E",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 22,
  },
  confirmText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 1,
  },
});
