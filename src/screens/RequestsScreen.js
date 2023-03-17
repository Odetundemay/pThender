import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const RequestsScreen = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const token = await AsyncStorage.getItem("access");
      const response = await axios.get(
        "https://thender.onrender.com/peer/requests/?type=received",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data.results);
      await AsyncStorage.setItem(
        "pendingRequests",
        JSON.stringify(response.data.results)
      );
    } catch (error) {
      console.error(error.response ? error.response.data : error);
    } finally {
      setLoading(false);
    }
  };

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

  const renderItem = ({ item }) => (
    <View style={{ padding: 10 }}>
      <Text>User ID: {item.id}</Text>
      <Text>Username: {item.user.username}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
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
