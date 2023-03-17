import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const RequestsScreen = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch data from server
  const fetchRequests = async () => {
    try {
      // Get access token from AsyncStorage
      const token = await AsyncStorage.getItem("access");
      // Make a GET request to the server
      const response = await axios.get(
        "https://thender.onrender.com/peer/requests/?type=sent",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Set the fetched data to state and save to AsyncStorage
      setData(response.data.results);
      await AsyncStorage.setItem(
        "pendingRequests",
        JSON.stringify(response.data.results)
      );
    } catch (error) {
      // Log any errors in the console
      console.error(error.response ? error.response.data : error);
    } finally {
      // Set loading to false regardless of whether the fetch request was successful or not
      setLoading(false);
    }
  };

  // Load data from AsyncStorage and fetch new data when the component mounts
  useEffect(() => {
    const getData = async () => {
      const pendingRequests = await AsyncStorage.getItem("pendingRequests");
      if (pendingRequests) {
        setData(JSON.parse(pendingRequests));
      }
      fetchRequests();
    };
    getData();
  }, []);

  const defaultAvatar = require("../assets/defaultavatar.jpeg");

  // Function to render each item in the FlatList
  const renderItem = ({ item }) => (
    <View
      style={{
        margin: 20,
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

      <Text style={{ fontSize: 18 }}>{item.user.username}</Text>
      <TouchableOpacity
        onPress={() => handleSend(item.id)}
        style={{
          paddingVertical: 5,
          paddingHorizontal: 15,
          borderWidth: 1,
          borderRadius: 10,
          borderColor: "red",
        }}
      >
        <Text>Cancel</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
};

export default RequestsScreen;

const styles = StyleSheet.create({});
