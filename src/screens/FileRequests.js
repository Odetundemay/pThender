import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { w3cwebsocket as W3CWebSocket } from "websocket";

const SOCKET_URL = "wss://thender.onrender.com/";

const acceptWithWebSocket = async (token, transmissionId) => {
  try {
    const client = new W3CWebSocket(`${SOCKET_URL}?token=${token}`);

    const roomId = transmissionId;
    const event = {
      type: "accept",
      roomId: roomId,
    };

    client.onopen = () => {
      console.log("WebSocket Client Connected from accept");

      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(event));
      } else {
        console.error("WebSocket is not in the OPEN state");
      }
    };

    client.onerror = (error) => {
      console.log("An erro has occured", error);
    };

    return () => {
      client.close();
    };
  } catch (err) {
    console.log(err);
  }
};

const FileRequests = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFileRequests = async () => {
    try {
      //Get access token from AsyncStorage
      const token = await AsyncStorage.getItem("access");
      const response = await axios.get(
        "https://thender.onrender.com/transmission/pending/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data.results);

      await AsyncStorage.setItem(
        "pendingFileRequests",
        JSON.stringify(response.data.results)
      );
    } catch (error) {
      console.error(error.response ? error.response.data : error);
    } finally {
      // Set loading to false regardless of whether the fetch request was successful or not
      setLoading(false);
    }
  };

  const acceptFileRequests = async (transmissionId) => {
    try {
      //Get access token from AsyncStorage
      const token = await AsyncStorage.getItem("access");
      const response = await axios.get(
        `https://thender.onrender.com/transmission/accept/${transmissionId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      //   Accept the request and emit the event
      await acceptWithWebSocket(token, transmissionId);
      console.log("Success accepting request");

      // Refetch the file requests data after accepting a request
      fetchFileRequests();
    } catch (error) {
      console.error(error.response ? error.response.data : error);
    }
  };

  const getData = async () => {
    const pendingFileRequests = await AsyncStorage.getItem(
      "pendingFileRequests"
    );
    if (pendingFileRequests) {
      setData(JSON.parse(pendingFileRequests));
    }
    fetchFileRequests();
  };

  useEffect(() => {
    getData();
  }, []);

  // Function to render each item in the FlatList
  const renderItem = ({ item }) => (
    <View>
      <View
        style={{
          margin: 20,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 18 }}>{item.sender.username}</Text>
        <Text>{item.file_name}</Text>
        <Text>{item.total_size}</Text>
        <TouchableOpacity
          style={{
            paddingVertical: 5,
            paddingHorizontal: 15,
            borderWidth: 1,
            borderRadius: 10,
            borderColor: "red",
          }}
          onPress={() => acceptFileRequests(item.id)}
        >
          <Text>Accept</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const onRefresh = () => {
    setRefreshing(true);
    getData();
    setRefreshing(false);
  };

  return (
    <View>
      <Text>FileRequests</Text>
      <FlatList
        data={data}
        renderItem={renderItem}
        refreshing={refreshing}
        onRefresh={onRefresh}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default FileRequests;

const styles = StyleSheet.create({});
