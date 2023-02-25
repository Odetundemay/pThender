import { View, Text, TouchableOpacity } from "react-native";
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
      // headerShown: false,
      title: "",
      headerRight: () => (
        <View
          style={{
            width: 80,
            flexDirection: "row",
            justifyContent: "space-between",
            backgroundColor: "white",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <TouchableOpacity>
            <AntDesign name="search1" size={24} color="#0011FF" />
          </TouchableOpacity>
          <TouchableOpacity>
            <SimpleLineIcons
              name="options-vertical"
              size={24}
              color="#0011FF"
            />
          </TouchableOpacity>
        </View>
      ),
      headerLeft: () => {
        <View>
          <Text>Thender</Text>
        </View>;
      },
    });
  }, []);
  return (
    <View>
      <Text>PeerScreenwithNoPeers</Text>
    </View>
  );
};

export default PeerScreenwithNoPeers;
