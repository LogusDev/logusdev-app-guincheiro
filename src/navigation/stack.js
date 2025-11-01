import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { NavigationContainer } from "@react-navigation/native";

import Login from "../screens/Login";
import { DriverProvider } from "../contexts/DriverContext";
import Home from "../screens/Home";
import DetalheChamado from "../screens/DetalheChamado";

const Stack = createNativeStackNavigator();

export default function Navigation() {
    return (
        <DriverProvider>
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }} >
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="DetalheChamado" component={DetalheChamado} />
            </Stack.Navigator>
        </NavigationContainer>
        </DriverProvider>
    );
}