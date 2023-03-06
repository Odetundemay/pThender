import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignUpScreen from "./screens/SignUpScreen";
import LogInScreen from "./screens/LogInScreen";
import ProgressScreen from "./screens/ProgressScreen";
import RequestsScreen from "./screens/RequestsScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import PeerScreens from "./screens/PeerScreens";
import { useEffect } from "react";
import { loadFonts } from "./components/fonts";

import { StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";

import {
  MaterialIcons,
  MaterialCommunityIcons,
  Feather,
} from "@expo/vector-icons";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const SearchIcon = ({ onPress }) => (
  <TouchableOpacity style={styles.searchIcon} onPress={onPress}>
    {/* You can use your own search icon */}
    <Text>🔍</Text>
  </TouchableOpacity>
);

const SearchBar = ({ value, onChangeText, onSubmit }) => (
  <TextInput
    style={styles.searchBar}
    value={value}
    onChangeText={onChangeText}
    onSubmitEditing={onSubmit}
    placeholder="Search"
    placeholderTextColor="#888"
  />
);

const AppTab = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchIconPress = () => {
    // TODO: Add logic to toggle search bar visibility
  };

  const handleSearchTextChange = (text) => {
    setSearchQuery(text);
  };

  const handleSearchSubmit = () => {
    // TODO: Add logic to perform search
  };

  const tabOptions = {
    headerRight: () => <SearchIcon onPress={handleSearchIconPress} />,
    headerTitle: () => (
      <SearchBar
        value={searchQuery}
        onChangeText={handleSearchTextChange}
        onSubmit={handleSearchSubmit}
      />
    ),
  };
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarStyle: { backgroundColor: "#000000" },
        tabBarActiveTintColor: "#0011FF",
        headerRight: () => <SearchIcon onPress={handleSearchIconPress} />,
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

const styles = StyleSheet.create({
  searchIcon: {
    marginRight: 16,
    paddingHorizontal: 8,
  },
  searchBar: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
  },
});

export default function App() {
  useEffect(() => {
    async function loadFontsAsync() {
      loadFonts;
    }
    loadFontsAsync;
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="LogIn" component={LogInScreen} />
        <Stack.Screen
          name="Thender"
          component={AppTab}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
