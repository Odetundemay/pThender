import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import PeerScreens from "../screens/PeerScreens";
import ProgressScreen from "../screens/ProgressScreen";
import RequestsScreen from "../screens/RequestsScreen";
import {
  MaterialIcons,
  MaterialCommunityIcons,
  Feather,
} from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

const AppTab = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarStyle: { backgroundColor: "#000000" },
        tabBarActiveTintColor: "#0011FF",
      }}
    >
      <Tab.Screen
        name="Peers"
        component={PeerScreens}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="family-restroom" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Progress"
        component={ProgressScreen}
        options={{
          tabBarBadge: 2,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="progress-download"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Requests"
        component={RequestsScreen}
        options={{
          tabBarBadge: 5,
          tabBarIcon: ({ color, size }) => (
            <Feather name="send" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AppTab;
