import { useState, useEffect } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import React from "react";
import { loadFonts } from "./fonts";

const CustomButton = ({ onPress, title, color }) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    loadFonts()
      .then(([loaded, error]) => {
        if (!loaded) {
          console.log(error);
          return null;
        }
        setFontsLoaded(true);
      })
      .catch((error) => console.log(error));
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.buttonContainer}>
      <Pressable
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? "red" : color,
          },
          styles.button,
        ]}
        onPress={onPress}
      >
        <Text style={styles.text}>{title}</Text>
      </Pressable>
    </View>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 10,
    marginBottom: 50,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    padding: 20,
    borderRadius: 20,
    paddingHorizontal: 30,
    width: "100%",
  },
  text: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "comfortaa-regular",
  },
});
