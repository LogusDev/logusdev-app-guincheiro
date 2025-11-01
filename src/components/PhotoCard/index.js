import { StyleSheet, View, Image } from "react-native";
import { useContext } from "react";
import { DriverContext } from "../../contexts/DriverContext";


export default function PhotoCard(){
    const { driver } = useContext(DriverContext);

    return(
        <View>
            <Image
            src={driver.foto_url}
            width={59}
            height={59}
            style={{borderRadius:40,borderColor:'#EF8108',borderWidth:3}}
            />
        </View>
    )
}