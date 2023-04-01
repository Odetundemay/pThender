import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import SignUpScreen from "../screens/SignUpScreen";
import LogInScreen from "../screens/LogInScreen";
import { AuthContext } from "../context/AuthContext";
import AppTab from "../navigation/TabNavigator";
import SplashScreen from "../screens/SplashScreen";
import SettingsScreen from "../screens/SettingsScreen";
import SenderScreen from "../screens/SenderScreen";
import AcceptPeerRequestScreen from "../screens/AcceptPeerRequestsScreen";

const Stack = createNativeStackNavigator();

const Navigation = () => {
  const { userInfo, splashLoading } = useContext(AuthContext);

  return (
    <NavigationContainer>
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
              name="Peer Requests"
              component={AcceptPeerRequestScreen}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="LogIn" component={LogInScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
