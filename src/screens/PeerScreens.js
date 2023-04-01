import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from "expo-document-picker";
import * as Crypto from "expo-crypto";
import * as FileSystem from "expo-file-system";

const PeerScreens = () => {
  const [access, setAccess] = useState(null);
  const [peers, setPeers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAccessToken();
  }, []);

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

      // Save new access token to AsyncStorage
      if (access) {
        await AsyncStorage.setItem("access", access);
        console.log("New access token saved to AsyncStorage");
        setAccess(access);
      } else {
        console.log("Failed to retrieve new access token from server");
      }
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Error",
        "Failed to retrieve access token. Please try again later."
      );
    }
  };

  const fetchPeers = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    };

    try {
      const response = await axios.get(
        "https://thender.onrender.com/peer/all/",
        config
      );
      console.log("Response data:", response.data);
      setPeers(response.data.results);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching peers:", error);
      setLoading(false);
    }
  };

  const defaultAvatar = require("../assets/defaultavatar.jpeg");

  const sendTransmission = async (receiverId) => {
    try {
      if (!receiverId) {
        throw new Error("Receiver ID is required");
      }

      const file = await DocumentPicker.getDocumentAsync();
      console.log("File:", file);
      console.log("File_location", file.uri);
      const fileData = await FileSystem.readAsStringAsync(file.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const fileHash = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        fileData
      );
      console.log("File hash:", fileHash);
      const config = {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      };
      const payload = {
        receiver: receiverId,
        file_name: file.name,
        file_location: file.uri,
        file_hash: fileHash,
        total_size: file.size,
      };
      const response = await axios.post(
        "https://thender.onrender.com/transmission/add/",
        payload,
        config
      );
      console.log("Transmission created:", response.data);
      Alert.alert("Success", "Transmission sent successfully");
    } catch (error) {
      console.log(error.response.data);
      console.log("Error creating transmission:", error);
      Alert.alert(
        "Error",
        "Failed to send transmission. Please try again later."
      );
    }
  };

  
  useEffect(() => {
    if (access) {
      fetchPeers();
    }
  }, [access]);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Image
        source={item.profile_picture || defaultAvatar}
        resizeMode="contain"
        style={{
          width: 50,
          height: 50,
          borderRadius: 25, // half of 50
        }}
      />
      <Text style={styles.itemText}>{item.username}</Text>
      <TouchableOpacity onPress={() => sendTransmission(item.id)}>
        <Text>Send transmission</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : peers.length > 0 ? (
        <FlatList
          data={peers}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <Text>No available peers</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  item: {
    padding: 20,
    backgroundColor: "#f1f1f1",
    borderRadius: 5,
    marginVertical: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default PeerScreens;
