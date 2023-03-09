import axios from "axios";
import React, { createContext, useState, useEffect } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../config";

export const AuthContext = createContext();

const api = axios.create({
  baseURL: "https://thender.onrender.com/account",
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

var raw =
  '{\n    "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY3ODY1MTYwMywiaWF0IjoxNjc4MzA2MDAzLCJqdGkiOiI1NjdhOTUxZjBiN2Q0NjlhYTJiNWUzZDc3OGMwZjZmNCIsInVzZXJfaWQiOiJiZDU0Y2QxYS1iYTM2LTRkZGYtOGE2My1iZGQyYjZhYjgxYWYifQ.YgIlN-TsdXUeqOaj5wDGqst8sBbGBjLgEE9OQOt4tCc"\n}';

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [splashLoading, setSplashLoading] = useState(false);

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
      let userInfo = response.data;
      console.log(response.status);
      console.log(response.headers);
      console.log(response.data);
      await AsyncStorage.setItem("userInfo", JSON.stringify(userInfo));
      setUserInfo(userInfo); // Set the userInfo state here
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      if (error.response) {
        // Request was made and server responded with a status code
        console.log(error.response.status);
        console.log(error.response.data);
        // Display a meaningful error message to the user
        Alert.alert(error.response.data.message);
      } else if (error.request) {
        // Request was made but no response was received
        console.log(error.request);
        // Display a meaningful error message to the user
        Alert.alert("No response from server, please try again later.");
      } else {
        // Something else happened in making the request
        console.log("Error", error.message);
        // Display a meaningful error message to the user
        Alert.alert("An error occurred, please try again later.");
      }
    }
  };

  const login = async (username, password) => {
    setIsLoading(true);
    try {
      const response = await api.post("/login/", {
        username,
        password,
      });
      let userInfo = response.data;
      console.log(response.status);
      console.log(response.headers);
      console.log(response.data);
      await AsyncStorage.setItem("userInfo", JSON.stringify(userInfo));
      setUserInfo(userInfo); // Set the userInfo state here
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      if (error.response) {
        // Request was made and server responded with a status code
        console.log(error.response.status);
        console.log(error.response.data);
        // Display a meaningful error message to the user
        Alert.alert(error.response.data.message);
      } else if (error.request) {
        // Request was made but no response was received
        console.log(error.request);
        // Display a meaningful error message to the user
        Alert.alert("No response from server, please try again later.");
      } else {
        // Something else happened in making the request
        console.log("Error", error.message);
        // Display a meaningful error message to the user
        Alert.alert("An error occurred, please try again later.");
      }
    }
  };

  const logout = () => {
    setIsLoading(true);

    const refreshToken = userInfo.refresh;

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`,
      },
      body: JSON.stringify({ refresh: refreshToken }),
    };

    fetch("https://thender.onrender.com/account/logout/", requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Logout failed");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        AsyncStorage.removeItem("userInfo");
        setUserInfo({});
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(`Logout error: ${error}`);
        setIsLoading(false);
      });
  };

  const isLoggedIn = async () => {
    try {
      setSplashLoading(true);

      let userInfo = await AsyncStorage.getItem("userInfo");
      userInfo = JSON.parse(userInfo);

      if (userInfo) {
        setUserInfo(userInfo);
      }

      setSplashLoading(false);
    } catch (error) {
      setSplashLoading(false);
      console.log(`is logged in error ${error}`);
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
