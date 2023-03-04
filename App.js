import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignUpScreen from "./screens/SignUpScreen";
import LogInScreen from "./screens/LogInScreen";
import ProgressScreen from "./screens/ProgressScreen";
import RequestsScreen from "./screens/RequestsScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import PeerScreens from "./screens/PeerScreens";

import * as Font from "expo-font";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const AppTab = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Peers" component={PeerScreens} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="Requests" component={RequestsScreen} />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="LogIn" component={LogInScreen} />
        <Stack.Screen name="Thender" component={AppTab} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
