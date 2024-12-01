import {
  getPermissionsAsync,
  requestPermissionsAsync,
  setNotificationHandler,
  setNotificationChannelAsync,
  AndroidImportance,
} from "expo-notifications";
import { Platform } from "react-native";

export const registerForPushNotifications = async () => {
  const { status: existingStatus } = await getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    return null;
  }
  if (Platform.OS === "android") {
    await setNotificationChannelAsync("default", {
      name: "default",
      importance: AndroidImportance.DEFAULT,
    });
  }
  return true;
};

export const registerForShowingNotificationWhenAppIsInTheForeground =
  async () => {
    setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
  };
