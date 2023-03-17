import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SettingsScreen = () => {
  const [firstName, setFirstName] = useState("John");
  const [lastName, setLastName] = useState("Doe");
  const [username, setUsername] = useState("johndoe");
  const [email, setEmail] = useState("johndoe@example.com");
  const [profileData, setProfileData] = useState("");

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = await AsyncStorage.getItem("access");
        let profileData = await AsyncStorage.getItem("profileData");

        if (!profileData) {
          const response = await axios.get(
            "https://thender.onrender.com/account/profile/",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          profileData = response.data;
          await AsyncStorage.setItem(
            "profileData",
            JSON.stringify(profileData)
          );
        } else {
          profileData = JSON.parse(profileData);
        }

        setProfileData(profileData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProfileData();
  }, []);

  const handlePress = () => {
    // Handle changing details
    console.log("Button pressed");
  };

  const defaultAvatar = require("../assets/defaultavatar.jpeg");

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.infoContainer}>
        <View>
          <Image
            source={profileData.profile_picture || defaultAvatar}
            resizeMode="contain"
            style={{
              height: 150,
              width: 150,
              borderRadius: 75,
              marginRight: 30,
            }}
          />
        </View>
        <View>
          <Text style={styles.label}>Username:</Text>
          <Text style={styles.text}>{profileData.username}</Text>
          <Text style={styles.label}>First Name:</Text>
          <Text style={styles.text}>{profileData.first_name}</Text>
          <Text style={styles.label}>Last Name:</Text>
          <Text style={styles.text}>{profileData.last_name}</Text>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.text}>{profileData.email}</Text>
          <TouchableOpacity style={styles.button} onPress={handlePress}>
            <Text style={styles.buttonText}>Change Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
  },
  infoContainer: {
    backgroundColor: "#F6F6F6",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 70,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "black",
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#2196F3",
    borderRadius: 10,
    padding: 15,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SettingsScreen;
