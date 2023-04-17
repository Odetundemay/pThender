import { useLayoutEffect, useContext, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import {
  Feather,
  SimpleLineIcons,
  AntDesign,
  Ionicons,
} from "@expo/vector-icons";
import CustomButton from "../components/CustomButton";
import { AuthContext } from "../context/AuthContext";
import Spinner from "react-native-loading-spinner-overlay/lib";
import { useNavigation } from "@react-navigation/native";

const SignUpScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { isLoading, register } = useContext(AuthContext);

  const onChangeuserNameHandler = (username) => {
    setUsername(username);
  };

  const onChangeFirstNameHandler = (first_name) => {
    setFirstName(first_name);
  };
  const onChangeLastNameHandler = (last_name) => {
    setLastName(last_name);
  };

  const onChangeEmailHandler = (email) => {
    setEmail(email);
  };

  const onChangePassword = (password) => {
    setPassword(password);
  };

  const handleSignUp = () => {
    if (
      username === "" ||
      first_name === "" ||
      last_name === "" ||
      email === "" ||
      password === ""
    ) {
      // If any input field is empty, show an error message to the user
      Alert.alert("Error", "Please fill all the input fields.");
    } else {
      // Otherwise, call the register function to perform SignUp
      register(username, email, first_name, last_name, password);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "",
      headerLeft: null,
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
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <View
              style={{
                width: 100,
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
                }}
              >
                Log In
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  const keyboardVerticalOffset = Platform.OS === "ios" ? 100 : -100;

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      bounces={false}
      showsVerticalScrollIndicator={false}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
        keyboardVerticalOffset={keyboardVerticalOffset}
      >
        <Spinner visible={isLoading} />
        <View style={styles.imageContainer}>
          <Image
            source={require("../assets/signupillustrate.png")}
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
            Sign Up
          </Text>
        </View>

        {/* Show error message to user */}
        {/* {errorMessage ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null} */}
        {/* input container   */}
        <View style={styles.inputContainer}>
          <AntDesign
            name="idcard"
            size={24}
            color="black"
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            value={username}
            placeholder="Enter username"
            onChangeText={onChangeuserNameHandler}
          />
        </View>

        <View style={styles.inputContainer}>
          <AntDesign
            name="idcard"
            size={24}
            color="black"
            style={styles.icon}
          />
          <TextInput
            placeholder="First Name"
            style={styles.input}
            value={first_name}
            onChangeText={onChangeFirstNameHandler}
          />
        </View>

        <View style={styles.inputContainer}>
          <AntDesign
            name="idcard"
            size={24}
            color="black"
            style={styles.icon}
          />

          <TextInput
            placeholder="Last Name"
            style={styles.input}
            value={last_name}
            onChangeText={onChangeLastNameHandler}
          />
        </View>
        <View style={styles.inputContainer}>
          <Ionicons name="md-at" size={24} color="black" />
          <TextInput
            placeholder="Enter  Email"
            style={styles.input}
            value={email}
            keyboardType="email-address"
            onChangeText={onChangeEmailHandler}
          />
        </View>
        <View style={styles.inputContainer}>
          <SimpleLineIcons name="lock" size={24} color="black" />
          <TextInput
            placeholder="password"
            style={styles.input}
            value={password}
            onChangeText={onChangePassword}
            secureTextEntry={true}
          />
        </View>
        <CustomButton title="Sign Up" color="blue" onPress={handleSignUp} />
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

export default SignUpScreen;

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
  errorContainer: {
    backgroundColor: "red",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginBottom: 8,
  },
  errorText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
});
