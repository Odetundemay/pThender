import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import PeerScreens from "../screens/PeerScreens";
import ProgressScreen from "../screens/ProgressScreen";
import RequestsScreen from "../screens/RequestsScreen";
import {
  MaterialIcons,
  MaterialCommunityIcons,
  Feather,
  Ionicons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { View, Text, TouchableOpacity, Alert } from "react-native";

const Tab = createBottomTabNavigator();

const AppTab = ({ navigation }) => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarStyle: { backgroundColor: "#000000" },
        tabBarActiveTintColor: "#0011FF",
        headerStyle: {
          backgroundColor: "#0011FF",
        },
        headerTintColor: "#fff",
      }}
    >
      <Tab.Screen
        name="Peers"
        component={PeerScreens}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="family-restroom" size={size} color={color} />
          ),
          headerRight: () => {
            return (
              <View
                style={{
                  width: 100,
                  flexDirection: "row",
                  justifyContent: "space-around",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <TouchableOpacity>
                  <Ionicons name="search-sharp" size={28} color="white" />
                </TouchableOpacity>
                <TouchableOpacity>
                  <SimpleLineIcons
                    name="options-vertical"
                    size={24}
                    color="white"
                  />
                </TouchableOpacity>
              </View>
            );
          },
          headerLeft: () => {
            return (
              <Text
                style={{
                  fontSize: 30,
                  color: "white",
                  marginLeft: 15,
                }}
              >
                Thender
              </Text>
            );
          },
          headerTitle: "",
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
          headerRight: () => {
            return (
              <View
                style={{
                  alignItems: "center",
                  marginRight: 20,
                }}
              >
                <TouchableOpacity>
                  <SimpleLineIcons
                    name="options-vertical"
                    size={24}
                    color="white"
                  />
                </TouchableOpacity>
              </View>
            );
          },
          headerLeft: () => {
            return (
              <Text
                style={{
                  fontSize: 30,
                  color: "white",
                  marginLeft: 15,
                }}
              >
                Thender
              </Text>
            );
          },
          headerTitle: "",
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
          headerRight: () => {
            return (
              <View
                style={{
                  alignItems: "center",
                  marginRight: 20,
                }}
              >
                <TouchableOpacity
                  onPress={() =>
                    Alert.alert("Options", "", [
                      {
                        text: "Settings",
                        onPress: () => navigation.navigate("Settings"),
                      },
                      {
                        text: "Exit",
                        onPress: () => console.log("Exit pressed"),
                      },
                    ])
                  }
                >
                  <SimpleLineIcons
                    name="options-vertical"
                    size={24}
                    color="white"
                  />
                </TouchableOpacity>
              </View>
            );
          },
          headerLeft: () => {
            return (
              <Text
                style={{
                  fontSize: 30,
                  color: "white",
                  marginLeft: 15,
                }}
              >
                Thender
              </Text>
            );
          },
          headerTitle: "",
        }}
      />
    </Tab.Navigator>
  );
};

export default AppTab;
