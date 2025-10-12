import { Text, Image, StatusBar, TouchableOpacity, KeyboardAvoidingView,Platform,ActivityIndicator } from "react-native";
import styles from './styles.js';
import TextInputComponent from "../../components/TextInput";
import Button from "../../components/Button";
import { useState } from "react";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { DriverContext } from "../../contexts/DriverContext.js";
import { useContext } from "react";
import SvgHome from '../../assets/images/svgHome.svg';

export default function Login(){
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false)

    const {login} = useContext(DriverContext);

    const errorAlert = () => {
        Toast.show({
            type:'error',
            text1:'Erro ao efetuar login',
            text2:'Verifique suas credenciais e tente novamente',
            position:'bottom',
            visibilityTime:1500,
            bottomOffset:300
        })
    }

        const emailAlert = () => {
        Toast.show({
            type:'error',
            text1:'E-mail inválido!',
            text2:'Verifique suas credenciais e tente novamente',
            position:'bottom',
            visibilityTime:1500,
            bottomOffset:300
        })
    }

    const successAlert = () => {
        Toast.show({
            type:'success',
            text1:'Login efetuado com sucesso.',
            text2:'Navegando para a próxima tela.',
            position:'top',
            visibilityTime:1500,
        })
    }

    const handleLogin = async () => {
        if (!email || !password){
            errorAlert();
            return;
        }

        if(!email.includes('@') || !email.includes('.')){
            emailAlert();
            return;
        }

        if(isLoading) return;
        setIsLoading(true);
        try{
            const response = await login({email,senha: password});
            successAlert();
            console.log('login feito')
            setTimeout(()=>{
                navigation.navigate('MainHome');
            },1500)
        } catch (error){
            console.log(error)
            console.log(email,password)
            errorAlert();
        } finally{
            setIsLoading(false)
        }

    }

    return(
        <KeyboardAvoidingView behavior="padding"
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        style={styles.container}>
            <StatusBar barStyle={'light-content'} backgroundColor={'#FFFFFF'} />
            <SvgHome width={356} height={328} />
            <Text style={styles.texto}>Acessar minha conta</Text>
            <TextInputComponent
            label={"E-mail"}
            placeholder={"Digite seu e-mail..."}
            value={email}
            onChangeText={setEmail}
            keyboardType={"email-address"}
            secureTextEntry={false}
            name={"mail-outline"}
            />
            <TextInputComponent
            label={"Senha"}
            placeholder={"Digite sua senha..."}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            name={"lock-closed-outline"}
            />
            <TouchableOpacity >
                <Text style={{color:"#616161", fontSize:14}}>
                    Não tem uma conta? <Text style={{color:"#1F284E", fontWeight:'bold', fontFamily:'Poppins-Regular'}}>Crie uma</Text>
                </Text>
            </TouchableOpacity>
            <Button text={isLoading ? <ActivityIndicator color="#fff" /> : "Entrar"} onPress={handleLogin} />
        </KeyboardAvoidingView>
    )


}

