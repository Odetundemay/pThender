import React, { useState } from "react";
import { View, Button, Text } from "react-native";
import * as DocumentPicker from "expo-document-picker"; // Import Expo's DocumentPicker API
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage for storing the token
import io from "socket.io-client"; // Import the socket.io client library

const SenderScreen = () => {
  const [status, setStatus] = useState("Disconnected"); // State for the connection status
  const [fileUri, setFileUri] = useState(""); // State for the file URI
  const [filePath, setFilePath] = useState(""); // State for the file path

  const send = async (socket, file_location, startByte) => {
    const CHUNK_SIZE = 1024 * 1024; // 1 MB
    const fileStream = fs.createReadStream(file_location, {
      start: startByte,
      encoding: "binary",
      highWaterMark: CHUNK_SIZE,
    });

    fileStream.on("data", (chunk) => {
      console.log("Sending data:", chunk); // Log the data being sent
      socket.send(chunk);
      sleep(800);
    });

    fileStream.on("end", () => {
      console.log("File upload completed");
    });
  };

  const transfer = async (token) => {
    const transmission_id = "ac3f65a5-50da-4fa5-a4bc-507cd991e2a8";
    const socket = io(
      `https://thender.onrender.com/${transmission_id}/?token=${token}`
    );

    socket.on("connect", () => {
      console.log("Connected");
      setStatus("Connected");

      // Send "connected" message to start the transmission
      socket.send("connected");
    });

    socket.on("message", (message) => {
      try {
        const transmission_details = JSON.parse(message);
        let file_location = transmission_details.file_location;
        let startByte = transmission_details.bytes_sent;
        let total_size = transmission_details.total_size;

        if (transmission_details.type === "send") {
          sleep(600);
          send(socket, file_location, startByte);
        } else if (transmission_details.type === "recieve") {
          let file_name = path.basename(file_location);
          let file_tmp_name = file_name + ".thtemp";
        }
      } catch (error) {
        // If data received is not JSON, then receive bytes and send to receive function
        receive(socket, message);
      }
    });

    socket.on("disconnect", () => {
      console.log("Disconnected");
      setStatus("Disconnected");
    });
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync();
      console.log("Result:", result); // Log the result object
      setFileUri(result.uri);
      setFilePath(result.uri); // Set the file path to the file URI
      console.log("File picked - fileUri:", fileUri);
      console.log("File picked - filePath:", filePath);

      // Store the file path in AsyncStorage for later use
      await AsyncStorage.setItem("@file_path", filePath);

      // Request a token from the server and start the transmission
      const response = await fetch(
        "https://thender.onrender.com/token/refresh/"
      );
      const data = await response.json();

      transfer(data.token);
    } catch (error) {
      console.log("Error picking document:", error);
      setStatus("Error picking document");
      return;
    }
  };

  return (
    <View>
      <Button title="Pick Document" onPress={pickDocument} />
      <Text>Status: {status}</Text>
    </View>
  );
};

export default SenderScreen;
