import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MyTabs from "./bottomTabs";

import { NavigationContainer } from "@react-navigation/native";

import Login from "../screens/Login";
import { DriverProvider } from "../contexts/DriverContext";
import Home from "../screens/Home";
import DetalheChamado from "../screens/DetalheChamado";
import CallProgress from "../screens/CallProgress";
import ActivityScreen from "../screens/ActivityScreen";
import ReceiptScreen from "../screens/ReceiptScreen";

const Stack = createNativeStackNavigator();

export default function Navigation() {
    return (
        <DriverProvider>
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }} >
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Home" component={MyTabs} />
                <Stack.Screen name="DetalheChamado" component={DetalheChamado} />
                <Stack.Screen name="CallProgress" component={CallProgress} />
                <Stack.Screen name="ActivityScreen" component={ActivityScreen} />
                <Stack.Screen name="ReceiptScreen" component={ReceiptScreen} />
            </Stack.Navigator>
        </NavigationContainer>
        </DriverProvider>
    );
}