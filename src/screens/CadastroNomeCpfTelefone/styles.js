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
    logo:{
        width:185.62,
        height:42.17,
        position:"absolute",
        top:70
    },
    texto:{
        fontSize:22,
        color:"#1F284E",
        padding:24,
        fontFamily:"Poppins-SemiBold",
        fontWeight:"bold",
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        zIndex: 10,
        padding: 8,
    },
})

export default styles;