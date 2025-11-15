import { StyleSheet } from "react-native";

export default StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F284E",
    marginBottom: 20,
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
    borderWidth: 2,
    borderColor: "#FFB100",
  },
  nome: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F284E",
  },

  addressBox: {
    marginBottom: 20,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 0,
  },
  iconContainer: {
    width: 28,
    alignItems: "center",
    marginTop: 2,
  },
  addressContent: {
    flex: 1,
    marginLeft: 10,
  },
  addressTitle: {
    fontSize: 16,
    color: "#1F284E",
    fontWeight: "600",
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: "#6C6C6C",
    lineHeight: 20,
  },

  dottedLineContainer: {
    height: 24,
    width: 28,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 0,
    marginVertical: 4,
  },
  dottedLine: {
    height: 24,
    width: 2,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 3,
  },
  dottedDot: {
    width: 3,
    height: 3,
    backgroundColor: "#C0C0C0",
    borderRadius: 1.5,
  },

  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 14,
  },

  carRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 16,
  },
  carIconContainer: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  carInfoContainer: {
    flex: 1,
  },
  carModel: {
    fontSize: 16,
    color: "#1F284E",
    fontWeight: "600",
    marginBottom: 4,
  },
  carDetails: {
    fontSize: 14,
    color: "#1F284E",
    lineHeight: 20,
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
    marginLeft: 4,
  },
  payment: {
    fontSize: 16,
    color: "#1F284E",
    fontWeight: "600",
    marginLeft: 8,
  },

  confirmButton: {
    backgroundColor: "#1F284E",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 22,
  },
  confirmText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 1,
  },
});
