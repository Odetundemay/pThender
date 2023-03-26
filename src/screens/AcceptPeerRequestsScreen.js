import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const AcceptPeerRequestScreen = ({ navigation }) => {
  const [requests, setRequests] = useState([]);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getToken();
  }, []);

  const getToken = async () => {
    try {
      const value = await AsyncStorage.getItem("access");
      if (value !== null) {
        console.log("Access token:", value);
        setToken(value);
        fetchRequests(value);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchRequests = async (token) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.get(
        "https://thender.onrender.com/peer/requests/?type=recieved",
        config
      );
      console.log("Response data:", response.data.results);
      setRequests(response.data.results);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching requests:", error);
      setLoading(false);
    }
  };

  const handleAccept = async (peerRequestId) => {
    console.log("Accepting peer request with ID:", peerRequestId);
    const raw = JSON.stringify({
      peer_request: peerRequestId,
      action: true,
    });

    const config = {
      method: "post",
      url: "https://thender.onrender.com/peer/handle-requests/",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: raw,
    };

    try {
      const response = await axios(config);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleReject = async (peerRequestId) => {
    console.log("Rejecting peer request with ID:", peerRequestId);
    const raw = JSON.stringify({
      peer_request: peerRequestId,
      action: false,
    });

    const config = {
      method: "post",
      url: "https://thender.onrender.com/peer/handle-requests/",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: raw,
    };

    try {
      const response = await axios(config);
      console.log(response.data);
    } catch (error) {
      console.log(error.response.data);
    }
  };

  const defaultAvatar = require("../assets/defaultavatar.jpeg");

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
        source={item.sender.profile_picture || defaultAvatar}
        resizeMode="contain"
        style={{
          width: 50,
          height: 50,
          borderRadius: 25,
        }}
      />

      <Text style={{ fontSize: 18 }}>{item.sender.username}</Text>
      <TouchableOpacity
        style={{
          paddingVertical: 5,
          paddingHorizontal: 15,
          borderWidth: 1,
          borderRadius: 10,
          borderColor: "red",
        }}
        onPress={() => handleAccept(item.id)}
      >
        <Text>Accept</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          paddingVertical: 5,
          paddingHorizontal: 15,
          borderWidth: 1,
          borderRadius: 10,
          borderColor: "red",
        }}
        onPress={() => handleReject(item.id)}
      >
        <Text>Reject</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (requests.length === 0) {
    return (
      <View style={styles.container}>
        <Text>No received requests</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={requests}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default AcceptPeerRequestScreen;
