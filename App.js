import React, { useState, useEffect } from "react";
import { StatusBar, View, Text } from "react-native";
import Navigation from "./src/components/Navigation";
import { AuthProvider } from "./src/context/AuthContext";
import NetInfo from "@react-native-community/netinfo";
import CheckNetworkState from "./CheckNetworkState";
import * as MediaLibrary from "expo-media-library";

const App = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isInternetReachable, setIsInternetReachable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      CheckNetworkState().then((networkState) => {
        setIsConnected(networkState.isConnected);
        setIsInternetReachable(networkState.isInternetReachable);
        setIsLoading(false);
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {}, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!isConnected) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Connection failed</Text>
        <Text>Please check your internet connection</Text>
      </View>
    );
  }

  if (!isInternetReachable) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>
          You are connected to the network, but there is no internet connection
        </Text>
      </View>
    );
  }

  return (
    <AuthProvider>
      <StatusBar backgroundColor="#0011FF" />
      <Navigation />
    </AuthProvider>
  );
};

export default App;
