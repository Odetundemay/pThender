import { View, Text } from "react-native";
import React from "react";
import { w3cwebsocket } from "websocket";
import { SOCKET_URL } from "./PeerScreens";
const ReceivingScreen = ({ route, navigation }) => {
  const { roomId, access } = route?.params;

  // Receive File

  const receiveFile = (roomId, accessToken) => {
    const [file, setFile] = useState(null);

    useEffect(() => {
      const client = new w3cwebsocket(
        `${SOCKET_URL}${roomId}?token=${accessToken}`
      );

      client.onmessage = (message) => {
        setFile(new Blob([message.data]));
        console.log("Received file");
        client.close();
      };

      client.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      return () => {
        if (client.readyState === client.OPEN) {
          client.close();
        }
      };
    }, [roomId, accessToken]);

    return file;
  };

  //   Received file
  const file = receiveFile(roomId, accessToken);

  return (
    <View>
      {file ? (
        <Text>Received file: {file.name}</Text>
      ) : (
        <Text>Waiting for file...</Text>
      )}
    </View>
  );
};

export default ReceivingScreen;
