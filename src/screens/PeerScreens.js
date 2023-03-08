import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect } from "react";
import { RFPercentage } from "react-native-responsive-fontsize";
import { loadFonts } from "../components/fonts";

const DATA = [
  {
    id: "1",
    name: "John Doe",
    profileImage: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: "2",
    name: "Jane Doe",
    profileImage: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    id: "3",
    name: "Bob Smith",
    profileImage: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    id: "4",
    name: "Alice Johnson",
    profileImage: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    id: "5",
    name: "Alice Johnson",
    profileImage: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    id: "6",
    name: "Alice Johnson",
    profileImage: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    id: "7",
    name: "Alice Johnson",
    profileImage: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    id: "8",
    name: "Alice Johnson",
    profileImage: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    id: "9",
    name: "Alice Johnson",
    profileImage: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    id: "10",
    name: "Alice Johnson",
    profileImage: "https://randomuser.me/api/portraits/women/2.jpg",
  },
];

const Item = ({ item }) => (
  <View style={styles.item}>
    <Image style={styles.profileImage} source={{ uri: item.profileImage }} />
    <Text style={styles.name}>{item.name}</Text>
    <TouchableOpacity style={styles.sendButton}>
      <Text style={styles.sendButtonText}>Send</Text>
    </TouchableOpacity>
  </View>
);

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
  const renderItem = ({ item }) => <Item item={item} />;
  return (
    <View style={styles.container}>
      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const PeerScreens = () => {
  const [peersAvailable, setPeersAvailable] = useState(false);

  // Call an API or use a state management library to get the number of available peers
  const numPeers = 1; // Replace with actual number of peers

  // Set the state of peersAvailable based on the number of peers
  useEffect(() => {
    setPeersAvailable(numPeers > 0);
  }, [numPeers]);

  return peersAvailable ? <AvailablePeers /> : <NoAvailablePeers />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: 50,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginVertical: 8,
    borderBottomColor: "#808080",
    borderBottomWidth: 1,
    padding: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  sendButton: {
    // backgroundColor: "#008CBA",
    borderColor: "#0011FF",
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 20,
    marginLeft: "auto",
  },
  sendButtonText: {
    color: "#0011FF",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default PeerScreens;
