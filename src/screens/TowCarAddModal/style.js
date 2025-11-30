import { StyleSheet, Dimensions } from "react-native";

const { height, width } = Dimensions.get("window");

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingVertical: 20,
  },

  container: {
    width: width * 0.9,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 25,
    paddingHorizontal: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 20,
    color: "#1E1E2F",
    textAlign: "center",
  },

  pickerWrapper: {
    width: "110%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 0,
  },

  textInput: {
    width: "90%",
    height: 50,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    color: "#333",
    borderWidth: 1,
    borderColor: "#ccc",
  },

  inputWithIcon: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 50,
    backgroundColor: "#FFF",
    marginBottom: 14,
    justifyContent: "center",
  },

  textInputWithIcon: {
    flex: 1,
    height: "100%",
    paddingRight: 40,
    fontSize: 16,
    color: "#333",
  },

  iconStyleRight: {
    position: "absolute",
    right: 10,
  },

  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#1F284E",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    shadowColor: "#1F284E",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  cancelText: {
    marginTop: 15,
    fontSize: 16,
    color: "#1F284E",
    fontWeight: "600",
    textAlign: "center",
  },
});

export default styles;
