import {
  getPermissionsAsync,
  requestPermissionsAsync,
} from "expo-notifications";

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
  return true;
};
