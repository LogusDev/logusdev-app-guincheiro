import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import Home from "../screens/Home";
import ActivityScreen from "../screens/ActivityScreen";
import TowCarSelection from "../screens/TowCarSelection";
import ProfileScreen from "../screens/Profile";

const Tab = createBottomTabNavigator();

export default function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#1F284E",
        tabBarInactiveTintColor: "#A5A5A5",
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: "#ddd",
          height: 78,
          elevation: 5,
          backgroundColor: "#fff",
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 5,
        },
        tabBarIconStyle: {
          marginTop: 5,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size={28} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Atividade"
        component={ActivityScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="hourglass-outline" size={28} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Guinchos"
        component={TowCarSelection}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="car-outline" size={28} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Perfil"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-circle" size={28} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
