import { StyleSheet } from "react-native";
import Constants from "expo-constants";

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#FFFFFF",
    },
    scrollContainer:{
        flexGrow:1,
        justifyContent:"center",
        alignItems:"center",
        paddingTop: (Constants.statusBarHeight || 0) + 10,
        paddingBottom: 20,
    },
    texto:{
        fontSize:22,
        fontWeight:"bold",
        color:"#1F284E",
        padding:8,
        fontFamily:"Poppins-SemiBold",
        fontWeight:"bold",
    },
    texto2:{
        textAlign:"center",
        color:"#929292",
        fontSize:13,
        paddingHorizontal:24,
        paddingBottom:24,
        marginTop: 10,
    },
})

export default styles;
