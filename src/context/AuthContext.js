import axios from "axios";
import React, { createContext, useState, useEffect } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../config";

export const AuthContext = createContext();

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(error);
    let errorMessage = "An error occurred";
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    }
    return Promise.reject(errorMessage);
  }
);

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [splashLoading, setSplashLoading] = useState(true);

  const handleApiError = async (error) => {
    console.error(error);

    const { response, request } = error;
    let errorMessage = "An error occurred";
    if (response) {
      const { data, status } = response;
      errorMessage = data.message || response.statusText;

      if (status === 401) {
        console.log("Access token invalid or expired, logging out...");
        await logout(); // Logout the user if access token is invalid or expired
      }
    } else if (request) {
      errorMessage = "No response from server, please try again later.";
    }
    Alert.alert(errorMessage);
  };

  const register = async (username, email, first_name, last_name, password) => {
    setIsLoading(true);
    try {
      const response = await api.post("/signup/", {
        username,
        first_name,
        last_name,
        email,
        password,
      });

      const { data } = response;
      await AsyncStorage.setItem("userInfo", JSON.stringify(data));
      setUserInfo(data);
      Alert.alert("Success", "You have successfully signed up!");
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username, password) => {
    setIsLoading(true);
    try {
      const response = await api.post("/login/", {
        username,
        password,
      });

      const { data } = response;
      await AsyncStorage.multiSet([
        ["access", data.access],
        ["refresh", data.refresh],
        ["userInfo", JSON.stringify(data)],
      ]);

      setUserInfo(data);
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const refreshToken = userInfo.refresh;
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`,
      };
      const data = { refresh: refreshToken };

      // Remove session from server
      await api.post("/logout/", data, { headers });

      // Remove tokens and user info from AsyncStorage
      await Promise.all([
        AsyncStorage.removeItem("access"),
        AsyncStorage.removeItem("refresh"),
        AsyncStorage.removeItem("userInfo"),
      ]);

      // Update user info state
      setUserInfo({});
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const isLoggedIn = async () => {
    try {
      const userInfoString = await AsyncStorage.getItem("userInfo");
      const userData = JSON.parse(userInfoString);

      if (userData) {
        setUserInfo(userData);
      }
    } catch (error) {
      console.error(`is logged in error ${error}`);
    } finally {
      setSplashLoading(false);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider
      value={{ isLoading, splashLoading, userInfo, register, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
