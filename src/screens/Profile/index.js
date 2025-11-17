import {View,Image,Text,StatusBar,ScrollView} from "react-native";
import styles from "./styles.js";
import { useContext } from 'react';
import { DriverContext } from '../../contexts/DriverContext.js';
import ProfileCard from "../../components/ProfileCard";
import Options from "../../components/Options/index.js"; 
import { useNavigation } from "@react-navigation/native";   

export default function Profile(){
    const {driver} = useContext(DriverContext);
    const navigation = useNavigation();
    return(
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#FFFFFF" />
            <View style={styles.viewTitle}>
            <Text style={styles.title}>Meu Perfil</Text>
            </View>
            <ProfileCard
             onPress={() => navigation.navigate('EditProfile')}
            />
            <Options name={"lock-closed-outline"} text={"Trocar senha"} />
            <Options name={"people-outline"} text={"Parcerias"} />
            <Options name={"help-circle-outline"} text={"Ajuda"} />
            <Options name={"information-circle-outline"} text={"Sobre nós"} />
            <Options name={"log-out-outline"} text={"Sair da conta"} color={'red'} />
        </View>
    )
}