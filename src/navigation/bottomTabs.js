import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {Ionicons} from '@expo/vector-icons';
import Home from "../screens/Home";
import ActivityScreen from "../screens/ActivityScreen";

const Tab = createBottomTabNavigator();

export default function MyTabs(){
    return(
        <Tab.Navigator
        screenOptions={{headerShown:false,
        tabBarItemStyle:{padding:12},
        tabBarStyle:{
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        height: 70,
        elevation: 5,
        position: 'absolute',
    }}}>
        <Tab.Screen name="Home" component={Home} options={{
        tabBarActiveTintColor:'#EF8108',
        tabBarInactiveTintColor:'#A5A5A5',
        tabBarIcon:({color,size})=>(
          <Ionicons name="home-outline" size={28} color={color} />
        ),
      }}/>

       <Tab.Screen name="Atividade" component={ActivityScreen} options={{
        tabBarActiveTintColor:'#EF8108',
        tabBarInactiveTintColor:'#A5A5A5',
        tabBarIcon:({color,size})=>(
          <Ionicons name="hourglass-outline" size={28} color={color} />
        ),
      }}/>

        </Tab.Navigator>
    )
}