import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PeerScreens = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [access, setAccess] = useState(null);

  useEffect(() => {
    const getAccessToken = async () => {
      try {
        const refresh = await AsyncStorage.getItem("refresh");
        console.log("Refresh token retrieved successfully:", refresh);

        // Get new access token from the server using refresh token
        const response = await axios.post(
          "https://thender.onrender.com/token/refresh/",
          {
            refresh,
          }
        );
        const { access } = response.data;
        console.log("New access token obtained:", access);
        setAccess(access);

        // Save new access token to AsyncStorage
        await AsyncStorage.setItem("access", access);
        console.log("New access token saved to AsyncStorage");
      } catch (error) {
        console.log(error);
        Alert.alert(
          "Error",
          "Failed to retrieve access token. Please try again later."
        );
      }
    };

    getAccessToken();
  }, []);

  const handleSearch = async () => {
    if (!query) {
      Alert.alert("Please enter a username");
      return;
    }

    const url = `https://thender.onrender.com/search/?q=${query}`;

    try {
      setLoading(true);

      const headers = {
        Authorization: `Bearer ${access}`,
        "Content-Type": "application/json",
      };

      const response2 = await axios.get(url, { headers });
      console.log("Search results:", response2.data);

      if (response2.data.results.length === 0) {
        Alert.alert("No available username. Please try again.");
        setLoading(false);
      } else {
        setResults(response2.data.results);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleSend = async (id) => {
    const headers = {
      Authorization: `Bearer ${access}`,
      "Content-Type": "application/json",
    };

    const data = {
      user: id,
    };

    axios
      .post("https://thender.onrender.com/peer/request/", data, { headers })
      .then((response) => {
        console.log(response.data);
        // handle success
      })
      .catch((error) => {
        // console.error(error.response.data);
        const errorMessage = error.response.data.non_field_errors
          ? error.response.data.non_field_errors
          : "An error occurred";
        Alert.alert("Error", JSON.stringify(errorMessage));
        // handle error
      });
  };

  const defaultAvatar = require("../assets/defaultavatar.jpeg");

  const renderItem = ({ item }) => (
    <View
      style={{
        // padding: 10,
        margin: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Image
        source={item.profile_picture || defaultAvatar}
        resizeMode="contain"
        style={{
          width: 50,
          height: 50,
          borderRadius: 25, // half of 50
        }}
      />

      <Text style={{ fontSize: 18 }}>{item.username}</Text>
      <TouchableOpacity
        onPress={() => handleSend(item.id)}
        style={{
          paddingVertical: 5,
          paddingHorizontal: 15,
          borderWidth: 1,
          borderRadius: 10,
          borderColor: "blue",
        }}
      >
        <Text>Send</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TextInput
        placeholder="Search for user"
        value={query}
        style={{ padding: 10, borderColor: "black", borderWidth: 1 }}
        onChangeText={(text) => setQuery(text)}
        autoCapitalize="none"
      />
      <TouchableOpacity
        onPress={handleSearch}
        style={{ backgroundColor: "blue", padding: 10, marginTop: 10 }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>Search</Text>
      </TouchableOpacity>
      {loading ? (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator size="large" color="blue" />
        </View>
      ) : (
        <FlatList
          data={results}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={{ marginTop: 20 }}
        />
      )}
    </View>
  );
};

export default PeerScreens;
