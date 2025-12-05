import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MyTabs from "./bottomTabs";

import { NavigationContainer } from "@react-navigation/native";
import Login from "../screens/Login";
import CadastroEmailSenha from "../screens/CadastroEmailSenha";
import CadastroNomeCpfTelefone from "../screens/CadastroNomeCpfTelefone";
import CadastroGuincho from "../screens/CadastroGuincho";
import CadastroPrecos from "../screens/CadastroPrecos";
import CadastroDocumentos from "../screens/CadastroDocumentos";
import { DriverProvider } from "../contexts/DriverContext";
import Home from "../screens/Home";
import DetalheChamado from "../screens/DetalheChamado";
import CallProgress from "../screens/CallProgress";
import ActivityScreen from "../screens/ActivityScreen";
import ReceiptScreen from "../screens/ReceiptScreen";
import EditProfile from "../screens/EditProfile";
import Help from '../screens/Help';
import About from '../screens/About';
import ChangePassword from '../screens/ChangePassword';
import Chat from "../screens/Chat";
import TowCarSelection from "../screens/TowCarSelection";
import Budget from "../screens/Budget";


const Stack = createNativeStackNavigator();

export default function Navigation() {
    return (
        <DriverProvider>
        <NavigationContainer>
            {/* <Stack.Navigator initialRouteName="CadastroGuincho" screenOptions={{ headerShown: false }} > */}
            <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }} >
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="CadastroEmailSenha" component={CadastroEmailSenha} />
                <Stack.Screen name="CadastroNomeCpfTelefone" component={CadastroNomeCpfTelefone} />
                <Stack.Screen name="CadastroGuincho" component={CadastroGuincho} />
                <Stack.Screen name="CadastroPrecos" component={CadastroPrecos} />
                <Stack.Screen name="CadastroDocumentos" component={CadastroDocumentos} />
                <Stack.Screen name="Home" component={MyTabs} />
                <Stack.Screen name="EditProfile" component={EditProfile} />
                <Stack.Screen name="DetalheChamado" component={DetalheChamado} />
                <Stack.Screen name="CallProgress" component={CallProgress} />
                <Stack.Screen name='Help' component={Help} />
                <Stack.Screen name='About' component={About} />
                <Stack.Screen name="ChangePassword" component={ChangePassword} />
                <Stack.Screen name="ActivityScreen" component={ActivityScreen} />
                <Stack.Screen name="ReceiptScreen" component={ReceiptScreen} />
                <Stack.Screen name="Chat" component={Chat} />
                <Stack.Screen name="TowCarSelection" component={TowCarSelection} />
                <Stack.Screen name="Budget" component={Budget} />
            </Stack.Navigator>
        </NavigationContainer>
        </DriverProvider>
    );
}