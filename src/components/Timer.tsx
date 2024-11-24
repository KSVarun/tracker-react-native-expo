import type { FC } from "react";
import { View, Text, Button } from "react-native";
import * as Notifications from "expo-notifications";

interface ITimerProps {}

export const Timer: FC<ITimerProps> = () => {
  return (
    <View>
      <Text>Timer</Text>
      <Button
        title="trigger"
        onPress={() => {
          Notifications.scheduleNotificationAsync({
            content: {
              title: "Reminder!",
              body: "This is your local notification.",
            },
            trigger: null,
          });
        }}
      />
    </View>
  );
};
