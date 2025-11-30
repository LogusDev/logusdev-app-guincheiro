import { StyleSheet } from "react-native";
import Constants from "expo-constants";

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#FFFFFF",
    },
    logo:{
        width:185.62,
        height:42.17,
        position:"absolute",
        top:70
    },
    texto:{
        fontSize:22,
        fontWeight:"bold",
        color:"#1F284E",
        padding:24,
    },
    texto2:{
        textAlign:"center",
        color:"#929292",
        fontSize:13,
        paddingHorizontal:24,
        paddingBottom:24,
    },
    scrollContainer:{
        flexGrow:1,
        justifyContent:"center",
        alignItems:"center",
        paddingTop: (Constants.statusBarHeight || 0) + 10,
        paddingBottom: 20,
    }
})

export default styles;