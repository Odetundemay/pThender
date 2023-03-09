import React, { useContext, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import Spinner from "react-native-loading-spinner-overlay/lib";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../context/AuthContext";

const ProgressScreen = ({ navigation }) => {
  const { userInfo, isLoading, logout } = useContext(AuthContext);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Call the logout function when the user logs out
  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    setIsLoggingOut(false);
    // setIsLoading(false);
    // Redirect the user to the login screen or home screen
    navigation.navigate("Thender", { screen: "LogIn" });
  };

  return (
    <View style={styles.container}>
      <Spinner visible={isLoading || isLoggingOut} />
      <Text style={styles.welcome}>Welcome {userInfo.access}</Text>
      <Button title="Logout" color="red" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  welcome: {
    fontSize: 18,
    marginBottom: 8,
  },
});

export default ProgressScreen;
