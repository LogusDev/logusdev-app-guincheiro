import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MyTabs from "./bottomTabs";

import { NavigationContainer } from "@react-navigation/native";
import Login from "../screens/Login";
import { DriverProvider } from "../contexts/DriverContext";
import Home from "../screens/Home";
import DetalheChamado from "../screens/DetalheChamado";
import CallProgress from "../screens/CallProgress";
import EditProfile from "../screens/EditProfile";
import Help from '../screens/Help';
import About from '../screens/About';
import ChangePassword from '../screens/ChangePassword';

const Stack = createNativeStackNavigator();

export default function Navigation() {
    return (
        <DriverProvider>
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }} >
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Home" component={MyTabs} />
                <Stack.Screen name="EditProfile" component={EditProfile} />
                <Stack.Screen name="DetalheChamado" component={DetalheChamado} />
                <Stack.Screen name="CallProgress" component={CallProgress} />
                <Stack.Screen name='Help' component={Help} />
                <Stack.Screen name='About' component={About} />
                <Stack.Screen name="ChangePassword" component={ChangePassword} />
            </Stack.Navigator>
        </NavigationContainer>
        </DriverProvider>
    );
}