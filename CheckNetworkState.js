import { StyleSheet } from "react-native";
import NetInfo from "@react-native-community/netinfo";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    textAlign: "center",
  },
});

const CheckNetworkState = () => {
  return new Promise((resolve) => {
    NetInfo.fetch().then((state) => {
      const isConnected = state.isConnected;
      const isInternetReachable = state.isInternetReachable;
      resolve({
        isConnected,
        isInternetReachable,
      });
    });
  });
};

export default CheckNetworkState;
