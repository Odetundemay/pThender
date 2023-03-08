import axios from "axios";
import React, { createContext } from "react";
import { Alert } from "react-native";

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

export const AuthProvider = ({ children }) => {
  const register = async (username, email, first_name, last_name, password) => {
    try {
      const response = await api.post("/signup/", {
        username,
        first_name,
        last_name,
        email,
        password,
      });
      console.log(response.status);
      console.log(response.headers);
      console.log(response.data);
    } catch (error) {
      console.error(error);
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

  return (
    <AuthContext.Provider value={{ register }}>{children}</AuthContext.Provider>
  );
};
