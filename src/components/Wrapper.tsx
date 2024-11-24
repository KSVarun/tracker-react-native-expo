import type { FC } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HabitTrackerWrapper } from "./HabitTrackerWrapper";
import { Timer } from "./Timer";

export const Tab = createBottomTabNavigator();

interface IWrapperProps {}

export const Wrapper: FC<IWrapperProps> = () => {
  return (
    <Tab.Navigator
      initialRouteName="timer"
      id={undefined}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="habit" component={HabitTrackerWrapper} />
      <Tab.Screen name="timer" component={Timer} />
    </Tab.Navigator>
  );
};
