import { useLayoutEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
} from "react-native";
import {
  Feather,
  SimpleLineIcons,
  AntDesign,
  Ionicons,
} from "@expo/vector-icons";
import CustomButton from "../components/CustomButton";

const SignUpScreen = ({ navigation }) => {
  const handlePress = () => {
    // Handle button press here
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
          <TouchableOpacity onPress={() => navigation.replace("LogIn")}>
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
                style={{ color: "#0011FF", textAlign: "center", fontSize: 18 }}
              >
                Log In
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      ),
    });
  }, []);

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
        <View style={styles.imageContainer}>
          <Image
            source={require("../assets/signupillustrate.png")}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        <View className="flex-row items-center mt-3 mb-7">
          <View className="bg-blue-900 w-1 h-9 mr-1 "></View>
          <Text className="text-3xl">Sign Up</Text>
        </View>

        {/* input container   */}
        <View style={styles.inputContainer}>
          <AntDesign
            name="idcard"
            size={24}
            color="black"
            style={styles.icon}
          />
          <TextInput placeholder="First Name" style={styles.input} />
        </View>

        <View style={styles.inputContainer}>
          <AntDesign
            name="idcard"
            size={24}
            color="black"
            style={styles.icon}
          />

          <TextInput placeholder="Last Name" style={styles.input} />
        </View>
        <View style={styles.inputContainer}>
          <Ionicons name="md-at" size={24} color="black" />

          <TextInput
            placeholder="Email"
            style={styles.input}
            keyboardType="email-address"
          />
        </View>
        <View style={styles.inputContainer}>
          <SimpleLineIcons name="lock" size={24} color="black" />
          <TextInput
            placeholder="Password"
            style={styles.input}
            secureTextEntry={true}
          />
        </View>
        <CustomButton
          title="Sign Up"
          color="blue"
          onPress={() => navigation.replace("LogIn")}
        />
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
});
