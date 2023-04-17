import React, { useState, useContext, useEffect } from "react";
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
  AntDesign,
} from "@expo/vector-icons";
import { View, Text, TouchableOpacity, Alert, TextInput } from "react-native";
import { AuthContext } from "../context/AuthContext";
import SearchScreen from "../screens/SearchScreen";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FileRequests from "../screens/FileRequests";

const Tab = createBottomTabNavigator();

const AppTab = ({ navigation }) => {
  const [pendingRequests, setPendingRequests] = useState(0);

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const token = await AsyncStorage.getItem("access");
        const response = await axios.get(
          "https://thender.onrender.com/peer/requests/?type=sent",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data.results.length);
        setPendingRequests(response.data.results.length);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPendingRequests();
  }, []);

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [token, setToken] = useState(null);

  const { logout } = useContext(AuthContext);
  const [setIsLoggingOut] = useState(false);

  // Call the logout function when the user logs out
  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    setIsLoggingOut(false);
  };

  useEffect(() => {
    getToken();
  }, []);

  const getToken = async () => {
    try {
      const value = await AsyncStorage.getItem("access");
      if (value !== null) {
        console.log("Access token:", value);
        setToken(value);
        handleSearch();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = async () => {
    if (!query) {
      return;
    }

    const url = `https://thender.onrender.com/search/?q=${query}`;

    try {
      setLoading(true);

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const response2 = await axios.get(url, { headers });
      console.log("Search results:", response2.data);

      if (response2.data.results.length === 0) {
        Alert.alert("No available username. Please try again.");
        setLoading(false);
      } else {
        setResults(response2.data.results);
        console.log("Search results", response2.data.results);
        setLoading(false);
      }
    } catch (error) {
      console.log(error.response2);
      setLoading(false);
    }
  };

  const handleInputChange = (value) => {
    setQuery(value);
  };

  useEffect(() => {
    if (query) {
      handleSearch();
    }
  }, [query]);

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
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("Search");
                  }}
                >
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
                  fontWeight: "bold",
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
        name="Search"
        options={({ navigation }) => ({
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="search1" size={size} color={color} />
          ),
          headerRight: () => {
            return (
              <View
                style={{
                  alignItems: "center",
                  marginRight: 15,
                }}
              >
                <TouchableOpacity
                  onPress={() =>
                    Alert.alert("Options", "", [
                      {
                        text: "Peer Requests",
                        onPress: () => navigation.navigate("Peer Requests"),
                      },
                      {
                        text: "Exit",
                        onPress: () => {
                          handleLogout();
                        },
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

          headerTitle: () => (
            <View
              style={{
                flex: 0.7,
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "white",
                borderRadius: 5,
                marginLeft: 15,
                width: 300,
              }}
            >
              <AntDesign
                name="search1"
                size={20}
                color="gray"
                style={{ marginLeft: 10 }}
              />
              <TextInput
                placeholder="Search"
                style={{
                  flex: 1,
                  fontSize: 16,
                  marginLeft: 10,
                  marginRight: 10,
                }}
                // onSubmitEditing={() => handleSearch(token, query)}
                value={query}
                onChangeText={handleInputChange}
              />
            </View>
          ),
        })}
      >
        {(props) => (
          <SearchScreen {...props} results={results} loading={loading} />
        )}
      </Tab.Screen>
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
        name="File Requests"
        component={FileRequests}
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
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("Search");
                  }}
                >
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
                  fontWeight: "bold",
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
          tabBarBadge: pendingRequests,
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
                        text: "Peer Requests",
                        onPress: () => navigation.navigate("Peer Requests"),
                      },
                      {
                        text: "Exit",
                        onPress: () => {
                          handleLogout();
                        },
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
