import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Image,
} from "react-native";
import {
  Feather,
  SimpleLineIcons,
  AntDesign,
  Ionicons,
} from "@expo/vector-icons";
import { useLayoutEffect } from "react";

const PeerScreenwithNoPeers = ({ navigation }) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  return (
    <SafeAreaView>
      <View style={styles.headerContainer}>
        <View>
          <Text className="text-white text-2xl ">Thender</Text>
        </View>
        <View style={styles.headerRightContainer}>
          <TouchableOpacity style={{ marginRight: 30 }}>
            <AntDesign name="search1" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <SimpleLineIcons name="options-vertical" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <View className="relative h-1/2">
        <Image
          source={require("../assets/nopeers.png")}
          className="absolute w-full h-full justify-center "
        />
      </View>
      <Text className="text-center text-4xl">No Peers!!!!</Text>
      <Text className="text-center text-lg">
        We couln't find anybody peers with on your {"\n"} network
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    alignItems: "center",
    backgroundColor: "#0011FF",
  },
  headerRightContainer: {
    flexDirection: "row",
    // paddingHorizontal: 20,
    // width: 80,
    // padding: 20,
  },
});

export default PeerScreenwithNoPeers;
