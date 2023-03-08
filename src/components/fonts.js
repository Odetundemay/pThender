import * as Font from "expo-font";

export const loadFonts = async () => {
  try {
    await Font.loadAsync({
      "comfortaa-bold": require("../assets/fonts/Comfortaa-Bold.ttf"),
      "comfortaa-light": require("../assets/fonts/Comfortaa-Light.ttf"),
      "comfortaa-meduim": require("../assets/fonts/Comfortaa-Medium.ttf"),
      "comfortaa-regular": require("../assets/fonts/Comfortaa-Regular.ttf"),
      "comfortaa-semibold": require("../assets/fonts/Comfortaa-SemiBold.ttf"),
    });
    return [true, null];
  } catch (error) {
    console.log(error);
    return [false, error];
  }
};
