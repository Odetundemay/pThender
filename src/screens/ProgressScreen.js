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

const ProgressScreen = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFileRequests = async () => {
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

      const res = response?.data?.results;
      const newRes = res.filter((i) => i.accepted);

      setData(newRes);

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

  // Trasnfer function
  let sleep = function (milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  };

  let send = function (socket, startByte) {
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
  let transfer = function (id, token) {
    // Variables
    let file_name = null;
    let file_tmp_name = null;
    let file_location = null;
    let total_size = null;
    transmission_id = id;

    let socket = new WebSocket(
      `ws://thender.onrender.com/${transmission_id}/?token=${token}`
    );

    socket.onopen = function (e) {
      console.log("[open] Connection established");
      socket.send("connected");
    };

    socket.onmessage = function (e) {
      try {
        console.log("E", JSON.parse(e.data));
        let transmission_details = JSON.parse(e.data);
        let file_location = transmission_details?.file_location;
        let startByte = transmission_details["bytes_sent"];
        let total_size = transmission_details["total_size"];

        /*
              Starts file transmssion when json data containing information about the
              transfer is recieved

              Note: Json data is only sent when both sender and reciever are ready
          */

        if (transmission_details.type === "send") {
          sleep(600);
          send(socket);
        } else if (transmission_details.type === "recieve") {
          // setup buffer name and target file name
          let file_name = path.basename(file_location);
          let file_tmp_name = file_name + ".thtemp";
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
      }
    };

    socket.onerror = function (e) {
      console.log(`[Error] Data received from server: ${e.error} ${e.message}`);
    };
  };

  // Conneect to web socket
  const connectToAllWebsocket = async () => {
    const token = await AsyncStorage.getItem("access");

    try {
      let id = data[0]?.id;

      transfer(id, token);

      return () => {
        // client.close();
      };
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (data) {
      connectToAllWebsocket();
    } else {
      console.log("No data");
    }
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
        <Text> size: {item.total_size}</Text>

        <Text>progress: {item.bytes_sent}</Text>
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
      <Text>ProgressScreen</Text>
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

export default ProgressScreen;

const styles = StyleSheet.create({});
