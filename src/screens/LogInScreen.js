import { useState, useEffect, useLayoutEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  StyleSheet,
  Image,
  Alert,
  TextInput,
} from "react-native";
import { Feather, SimpleLineIcons, Ionicons } from "@expo/vector-icons";
import CustomButton from "../components/CustomButton";
import { AuthContext } from "../context/AuthContext";
import Spinner from "react-native-loading-spinner-overlay/lib";
import { useNavigation } from "@react-navigation/native";

const LogInScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { isLoading, login } = useContext(AuthContext);

  const navigation = useNavigation();

  const handleLogIn = () => {
    if (username === "" || password === "") {
      // If any input field is empty, show an error message to the user
      Alert.alert("Error", "Please fill all the input fields.");
    } else {
      // Otherwise, call the login function to perform log in
      login(username, password);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      // headerShown: false,
      title: "",
      headerRight: () => (
        <View
          style={{
            width: 150,
            flexDirection: "row",
            justifyContent: "space-between",
            backgroundColor: "white",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <TouchableOpacity>
            <View
              style={{
                borderRadius: 24,
                borderColor: "#0011FF",
                borderWidth: 1,
                alignItems: "center",
                padding: 8,
              }}
            >
              <Feather name="wifi-off" size={24} color="#0011FF" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <View
              style={{
                width: 100,
                // height: 25,
                borderRadius: 16,
                borderColor: "#0011FF",
                borderWidth: 2,
                alignItems: "center",
                padding: 8,
              }}
            >
              <Text
                style={{
                  color: "#0011FF",
                  textAlign: "center",
                  fontSize: 18,
                  // fontFamily: "comfortaa-bold",
                }}
              >
                Sign Up
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      ),
    });
  }, []);

  const keyboardVerticalOffset = Platform.OS === "ios" ? 100 : -100;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      <Spinner visible={isLoading} />
      <View style={styles.imageContainer}>
        <Image
          source={require("../assets/loginillustrate.png")}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      <View className="flex-row items-center mt-3 mb-7">
        <View className="bg-blue-900 w-1 h-9 mr-1 "></View>
        <Text
          // style={{ fontFamily: "comfortaa-regular" }}
          className="text-3xl"
        >
          Log In
        </Text>
      </View>

      {/* input container   */}
      <View style={styles.inputContainer}>
        <Ionicons name="md-at" size={24} color="black" />

        <TextInput
          placeholder="Username"
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
      </View>
      <View style={styles.inputContainer}>
        <SimpleLineIcons name="lock" size={24} color="black" />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry={true}
        />
      </View>
      <CustomButton title="Log In" color="blue" onPress={handleLogIn} />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  imageContainer: {
    height: 180,
    width: "100%",
    marginBottom: 10,
  },
  image: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: "#9B9B9B",
    borderBottomWidth: 1,
    paddingBottom: 10,
    marginVertical: 20,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 18,
  },
  icon: {
    marginRight: 10,
  },
  textInput: {
    borderBottomColor: "#9B9B9B",
    borderBottomWidth: 1,
    flex: 1,
    marginLeft: 10,
    // paddingBottom: 8,
    marginBottom: 20,
    fontSize: 20,
  },
});

export default LogInScreen;
