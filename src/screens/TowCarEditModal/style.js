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
  },

  container: {
    width: width * 0.88,
    minHeight: height * 0.65,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 25,
    paddingHorizontal: 20,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    alignItems: "center",
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 15,
    color: "#1E1E2F",
    textAlign: "center",
  },


  pickerWrapper: {
    width: "110%",
    alignItems: "center",
    justifyContent: "center",
  },


  inputWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 50,
    backgroundColor: "#FFF",
    marginBottom: 10,
    width: "100%",
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
    top: "50%",
    marginTop: -12,
  },

  inputHalf: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#FFF",
    height: 50,
    paddingHorizontal: 10,
    justifyContent: "center",
  },

  cancelText: {
    marginTop: 12,
    fontSize: 15,
    color: "#1F284E",
    fontWeight: "600",
    textAlign: "center",
  },

  button: {
    width: "100%",
    height: 45,
    backgroundColor: "#1F284E",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#1F284E",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  closeButton: {
    position: "absolute",
    top: 15,
    right: 15,
    zIndex: 10,
    padding: 5,
  },

  textInput: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    color: "#333",
    backgroundColor: "#FFF",
    width: "100%",
  },
});

export default styles;
