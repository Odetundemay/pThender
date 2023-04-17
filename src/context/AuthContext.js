import axios from "axios";
import React, { createContext, useState, useEffect } from "react";
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../config";
import CustomModal from "../components/CustomModal";
import SucessCustomModal from "../components/SucessCustomModal";

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
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorModalTitle, setErrorModalTitle] = useState("");
  const [errorModalMessage, setErrorModalMessage] = useState("");
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleApiError = (error) => {
    let errorMessage = "An error occurred";
    if (error.response) {
      const { data } = error.response;
      if (data.non_field_errors && data.non_field_errors.length > 0) {
        errorMessage = data.non_field_errors[0];
      }
    }
    setErrorModalMessage(errorMessage);
    setErrorModalVisible(true);
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
      setSuccessMessage("You have successfully signed up!");
      setSuccessModalVisible(true);
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
      // if login is successful, set successModalVisible to true
      // setSuccessModalVisible(true);

      const { data } = response;
      await AsyncStorage.multiSet([
        ["access", data.access],
        ["refresh", data.refresh],
        ["userInfo", JSON.stringify(data)],
      ]);

      setUserInfo(data);
    } catch (error) {
      console.log("Login error: " + error.data);
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

  const closeModal = () => {
    setErrorModalVisible(false);
    setSuccessModalVisible(false);
  };

  return (
    <>
      <AuthContext.Provider
        value={{ isLoading, splashLoading, userInfo, register, login, logout }}
      >
        {children}
      </AuthContext.Provider>
      <CustomModal
        visible={errorModalVisible}
        title={errorModalTitle}
        message={errorModalMessage}
        onClose={closeModal}
      />
      <SucessCustomModal
        visible={successModalVisible}
        title="Success"
        message={successMessage}
        onClose={closeModal}
      />
    </>
  );
};
