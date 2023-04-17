import React, { useContext, useState, useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import NetInfo from "@react-native-community/netinfo";
import SignUpScreen from "../screens/SignUpScreen";
import LogInScreen from "../screens/LogInScreen";
import { AuthContext } from "../context/AuthContext";
import AppTab from "../navigation/TabNavigator";
import SplashScreen from "../screens/SplashScreen";
import SettingsScreen from "../screens/SettingsScreen";
import SenderScreen from "../screens/SenderScreen";
import AcceptPeerRequestScreen from "../screens/AcceptPeerRequestsScreen";
import { View, StyleSheet } from "react-native";
import CustomModal from "./CustomModal";
import ReceivingScreen from "../screens/ReceivingScreen";

const Stack = createNativeStackNavigator();

const Navigation = () => {
  const { userInfo, splashLoading } = useContext(AuthContext);
  const [isConnected, setIsConnected] = useState(true);
  const [isInternetReachable, setIsInternetReachable] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
      setIsInternetReachable(state.isInternetReachable);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <NavigationContainer>
      <View style={styles.container}>
        {!isConnected && (
          <CustomModal
            visible={!isInternetReachable}
            title="No internet connection"
            message="Please check your internet connection and try again"
          />
        )}
        {isConnected && (
          <Stack.Navigator>
            {splashLoading ? (
              <Stack.Screen
                name="Splash Screen"
                component={SplashScreen}
                options={{ headerShown: false }}
              />
            ) : userInfo.access ? (
              <>
                <Stack.Screen
                  name="Thender"
                  component={AppTab}
                  options={{ headerShown: false }}
                />
                <Stack.Screen name="Settings" component={SettingsScreen} />
                <Stack.Screen name="Sender" component={SenderScreen} />
                <Stack.Screen
                  name="ReceivingScreen"
                  component={ReceivingScreen}
                />

                <Stack.Screen
                  name="Peer Requests"
                  component={AcceptPeerRequestScreen}
                />
              </>
            ) : (
              <>
                <Stack.Screen name="Login" component={LogInScreen} />
                <Stack.Screen name="SignUp" component={SignUpScreen} />
              </>
            )}
          </Stack.Navigator>
        )}
      </View>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default Navigation;
