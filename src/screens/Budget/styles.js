import { StyleSheet } from "react-native";
import Constants from "expo-constants";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: (Constants.statusBarHeight || 0) + 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1F284E",
    fontFamily: "Poppins-SemiBold",
    marginBottom: 20,
    textAlign: "center",
  },
  texto: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1F284E",
    padding: 8,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 10,
  },
  texto2: {
    textAlign: "center",
    color: "#929292",
    fontSize: 13,
    paddingHorizontal: 24,
    paddingBottom: 24,
    marginTop: 10,
  },
  inputContainer: {
    width: "100%",
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#DADADA",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#1F284E",
    backgroundColor: "#F9F9F9",
  },
  button: {
    marginTop: 20,
    width: "100%",
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#1F284E",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Poppins-SemiBold",
  },
});

export default styles;
