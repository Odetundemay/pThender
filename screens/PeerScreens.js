import { StyleSheet, Text, View, Image } from "react-native";
import { useState, useEffect } from "react";
import { RFPercentage } from "react-native-responsive-fontsize";

//A component to render when there are no available peers
const NoAvailablePeers = () => {
  return (
    <View className="justify-center mx-3">
      <View className="relative h-1/2">
        <Image
          source={require("../assets/nopeers.png")}
          className="absolute w-full h-full justify-center "
        />
      </View>
      <View className="mt-5">
        <Text className="text-center text-3xl">No Peers!!!!</Text>
        <Text
          style={{
            fontSize: RFPercentage(2),
            textAlign: "center",
            marginTop: 10,
          }}
        >
          We couldn't find anybody peers with on your {"\n"} network
        </Text>
      </View>
    </View>
  );
};

//A component to render when there are available peers
const AvailablePeers = () => {
  <View>
    <Text>Hello Available Peers</Text>
  </View>;
};

const PeerScreens = () => {
  const [peersAvailable, setPeersAvailable] = useState(false);

  // Call an API or use a state management library to get the number of available peers
  const numPeers = 0; // Replace with actual number of peers

  // Set the state of peersAvailable based on the number of peers
  useEffect(() => {
    setPeersAvailable(numPeers > 0);
  }, [numPeers]);

  return peersAvailable ? <AvailablePeers /> : <NoAvailablePeers />;
};

export default PeerScreens;

const styles = StyleSheet.create({});
