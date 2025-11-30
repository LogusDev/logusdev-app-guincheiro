import StackNavigator from './src/navigation/stack';
import { useFonts } from 'expo-font';
import Toast from 'react-native-toast-message';
import { LogBox } from 'react-native';
import './src/services/firebase'; // Inicializa o Firebase

// Ignora logs que começam com o texto específico
LogBox.ignoreAllLogs();

// ... resto do seu código (import React, App, etc.)


export default function App(){
  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('./src/assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Bold': require('./src/assets/fonts/Poppins-Bold.ttf'),
    'Poppins-SemiBold': require('./src/assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Light': require('./src/assets/fonts/Poppins-Light.ttf'),
  });

  if(!fontsLoaded){
    return null;
  }
  
  return(
    <>
      <StackNavigator/>
      <Toast/>
    </>
  )
}