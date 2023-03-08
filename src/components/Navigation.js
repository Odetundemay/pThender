import { View, Text } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import SignUpScreen from "../screens/SignUpScreen";
import LogInScreen from "../screens/LogInScreen";
import PeerScreens from "../screens/PeerScreens";

const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="LogIn" component={LogInScreen} />
        <Stack.Screen name="PeerScreen" component={PeerScreens} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
