import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  Image,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from "expo-document-picker";
import * as Crypto from "expo-crypto";
import * as FileSystem from "expo-file-system";
import PeerScreenwithNoPeers from "./PeerScreenwithNoPeers";
import WebSocket from "ws";
import { w3cwebsocket as W3CWebSocket } from "websocket";

export const SOCKET_URL = "wss://thender.onrender.com/";

const PeerScreens = () => {
  const [file, setFile] = useState(null);
  const [access, setAccess] = useState(null);
  const accesRef = useRef(null);
  const [peers, setPeers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [roomId, setRoomId] = useState("");
  // const [socket, setSocket] = useState(null);

  // Get access token from async storage
  const getAccessToken = async () => {
    try {
      const refresh = await AsyncStorage.getItem("refresh");

      // Get new access token from the server using refresh token
      const response = await axios.post(
        "https://thender.onrender.com/token/refresh/",
        {
          refresh,
        }
      );
      const { access } = response.data;
      accesRef.current = access;

      // Save new access token to AsyncStorage
      if (access) {
        await AsyncStorage.setItem("access", access);

        setAccess(() => access);
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

  // Conneect to web socket
  const connectToWebSocket = async () => {
    try {
      const client = new W3CWebSocket(
        `${SOCKET_URL}?token=${accesRef.current}`
      );

      client.onopen = () => {
        console.log("WebSocket Client Connected");
      };

      client.onmessage = (message) => {
        const dataFromServer = JSON.parse(message.data);

        console.log(dataFromServer);
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

  //
  useEffect(() => {
    (async () => {
      await getAccessToken();

      // connectToWebSocket();
    })();
  }, []);

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

      setPeers(response.data.results);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching peers:", error);
      setLoading(false);
    }
  };

  const defaultAvatar = require("../assets/defaultavatar.jpeg");

  const transfer = function (token, transmission_id) {
    const socket = new W3CWebSocket(
      `${SOCKET_URL}${transmission_id}/?token=${accesRef.current}`
    );
    // console.log(`${SOCKET_URL}${transmission_id}/?token=${accesRef.current}`);

    socket.onopen = function (e) {
      socket.send("connected");
      console.log("Hello from transferf");
    };

    socket.onmessage = function (e) {
      console.log("-----------------");
      try {
        let transmission_details = JSON.parse(e.data);
        console.log("Transmission Details:---", transmission_details);
        file_location = transmission_details.file_location;
        startByte = transmission_details["bytes_sent"];
        total_size = transmission_details["total_size"];

        /*
                Starts file transmssion when json data containing information about the
                transfer is recieved

                Note: Json data is only sent when both sender and reciever are ready
            */

        if (transmission_details.type === "send") {
          // sleep(600);
          send(socket);
        } else if (transmission_details.type === "recieve") {
          // setup buffer name and target file name
          file_name = path.basename(file_location);
          file_tmp_name = file_name + ".thtemp";
          fs.openSync(file_name, "a");
        }
      } catch (error) {
        if (file_name === null) {
          // if data that is not json is sent and file name has not be set
          console.log(`An Error Occurred Disconnecting ${error}`);
          socket.close();
        } else {
          // if data recieved is not json, then recieve bytes and send to recieve function
          recieve(socket, e.data);
        }
        console.log(error);
      }
    };

    socket.onerror = function (e) {
      console.log(`[Error] Data received from server: ${e.error} ${e.message}`);
    };
  };

  const sendFile = (file, roomId, accessToken) => {
    const client = new W3CWebSocket(
      `${SOCKET_URL}${roomId}?token=${accessToken}`
    );

    client.onopen = () => {
      const reader = new FileReader();

      reader.onload = () => {
        const arrayBuffer = reader.result;
        client.send(arrayBuffer);
        client.close();
      };

      reader.readAsArrayBuffer(file);
    };

    client.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  };

  const send = function (socket, startByte) {
    /*
    Read bytes from the file in chunks and send to the server to be forwarded
    */

    const CHUNK_SIZE = 1024 * 1024; // 1 MB
    const fileStream = fs.createReadStream(file_location, {
      start: startByte,
      encoding: "binary",
      highWaterMark: CHUNK_SIZE,
    });

    fileStream.on("data", (chunk) => {
      socket.send(chunk);
      // waits 800 millisecond to allow data be handled before sending again
      sleep(800);
    });
    fileStream.on("end", () => {
      console.log("File upload completed");
    });
    return;
  };

  // Determine if the receiver has accepted on refresh
  const fetchFileRequests = async (file) => {
    try {
      //Get access token from AsyncStorage
      const token = await AsyncStorage.getItem("access");
      const response = await axios.get(
        "https://thender.onrender.com/transmission/all/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const requests = response?.data?.results;
      // console.log(requests);

      // Get the IDs of accepted requests
      const acceptedRequestIds = requests
        .filter((r) => r?.accepted)
        .map((r) => r.id);

      console.log(acceptedRequestIds, "accepted request");

      if (acceptedRequestIds.length > 0) {
        // Pass the first accepted request ID as the transmission ID
        const transmissionId = acceptedRequestIds[0];
        console.log(
          "Initiating transfer with transmission ID:",
          transmissionId
        );

        transfer(token, transmissionId);
        // Function to send file
        // sendFile(file, transmissionId, token);
      } else {
        console.log("No accepted requests found.");
      }

      let sleep = function (milliseconds) {
        const date = Date.now();
        let currentDate = null;
        do {
          currentDate = Date.now();
        } while (currentDate - date < milliseconds);
      };

      let copyBuffer = function () {
        const readBuffer = fs.createReadStream(file_tmp_name, {
          encoding: "binary",
        });
        // copies data from buffer to target file
        readBuffer.on("data", (chunk) => {
          fs.appendFileSync(file_name, chunk);
        });

        readBuffer.on("end", () => {
          // empties buffer
          fs.closeSync(fs.openSync(file_tmp_name, "w"));
        });
      };

      let recieve = function (socket, data) {
        // Add data buffer file
        fs.appendFileSync(file_tmp_name, data);
        console.log("Data appended to file!");

        const size_main = fs.statSync(file_name).size; // Size of the main file
        const size_tmp = fs.statSync(file_tmp_name).size; // Size of tmp file

        if (total_size == size_main + size_tmp) {
          socket.send("Done");
          copyBuffer();
        } else if (size_tmp == 100(1024 * 1024)) {
          /*
            Updates bytes sent on the server after every 100MB
            then copies the 100MB in buffer to original file
            */
          socket.send("recieved");
          copyBuffer();
        }
      };
    } catch (error) {
      console.error(error.response ? error.response.data : error);
    } finally {
      // Set loading to false regardless of whether the fetch request was successful or not
      // setLoading(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);

    (async () => {
      fetchPeers();
      fetchFileRequests();
    })();

    setRefreshing(false);
  };

  const sendData = (roomId) => {
    try {
    } catch (err) {
      throw new Error("Send data failed");
    }
  };

  const sendTransmission = async (receiverId) => {
    try {
      if (!access) {
        throw new Error("Access token not found");
      }
      if (!receiverId) {
        throw new Error("Receiver ID is required");
      }

      // Update the peers state with the latest data from the server
      await fetchPeers();
      const file = await DocumentPicker.getDocumentAsync();
      // console.log("File:", file);
      setFile(() => file);
      // console.log("File_location", file.uri);
      const fileData = await FileSystem.readAsStringAsync(file.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const fileHash = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        fileData
      );
      // console.log("File hash:", fileHash);
      // Create the transmission payload
      // Create the transmission payload
      const transmissionPayload = {
        reciever: receiverId,
        file_name: file.name,
        file_location: file.uri,
        file_hash: fileHash,
        total_size: file.size,
      };
      const config = {
        headers: {
          Authorization: `Bearer ${access}`,
          "Content-Type": "application/json",
        },
      };
      const response = await axios.post(
        "https://thender.onrender.com/transmission/add/",
        transmissionPayload,
        config
      );

      const res = response.data;

      setRoomId(() => res?.id);
      // console.log("Transmission created:", response.data);
      Alert.alert("Success", "Transmission sent successfully");

      console.log("-----------------");
      // fetchFileRequests();
      console.log("-----------------");
    } catch (error) {
      console.log(error.response);
      console.log("Error creating transmission:", error.response);
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
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={["#3a5cb4"]}
            />
          }
        />
      ) : (
        <PeerScreenwithNoPeers />
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
