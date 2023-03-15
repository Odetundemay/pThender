import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  Image,
  Button,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PeerScreens = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [access, setAccess] = useState(null);

  const handleSearch = async () => {
    if (!query) {
      Alert.alert("Please enter a username");
      return;
    }

    const url = `https://thender.onrender.com/search/?q=${query}`;

    try {
      setLoading(true);

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
    try {
      const headers = {
        Authorization: `Bearer ${access}`,
        "Content-Type": "application/json",
      };

      const data = {
        user: id,
      };

      const response = await axios.post(
        `https://thender.onrender.com/peer/request/`,
        data,
        {
          headers,
        }
      );
      console.log(response.data);
      // handle success
    } catch (error) {
      console.error(error);
      // handle error
    }
  };

  const renderItem = ({ item }) => (
    <View
      style={{
        padding: 10,
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <Image source={item.profile_picture} resizeMode="contain" />
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
