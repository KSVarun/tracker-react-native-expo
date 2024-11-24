import {
  Button,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Text,
} from "react-native";
import { QueryClient, QueryClientProvider } from "react-query";
import { MainTracker } from "./src/components/MainTracker";
import { TrackerLoader } from "./src/dataLoaders/TrackerLoader";
import { Fragment, useState } from "react";
import * as LocalAuthentication from "expo-local-authentication";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

export const Tab = createBottomTabNavigator();

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function Habit() {
  return (
    <TrackerLoader
      sheet="DailyTrack"
      render={(result, dataKeys, handleForcedRefresh) => (
        <MainTracker
          result={result}
          dataKeys={dataKeys}
          handleForcedRefresh={handleForcedRefresh}
        />
      )}
    />
  );
}

function Timer() {
  return (
    <View>
      <Text>Timer</Text>
    </View>
  );
}

function Wrapper() {
  return (
    <Tab.Navigator
      initialRouteName="habit"
      id={undefined}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="habit" component={Habit} />
      <Tab.Screen name="timer" component={Timer} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [authenticated, setAuthenticated] = useState(true);

  const authenticate = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (hasHardware && isEnrolled) {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate",
        fallbackLabel: "Use Passcode",
      });

      if (result.success) {
        setAuthenticated(true);
      } else {
        console.log("Authentication failed");
      }
    } else {
      console.log("Biometric authentication is not available or not set up");
    }
  };

  return (
    <Fragment>
      {authenticated ? (
        <QueryClientProvider client={queryClient}>
          <SafeAreaView style={styles.container}>
            <SafeAreaProvider>
              <NavigationContainer>
                <Wrapper />
                <StatusBar />
              </NavigationContainer>
            </SafeAreaProvider>
          </SafeAreaView>
        </QueryClientProvider>
      ) : (
        <View style={styles.unlockButton}>
          <Button title="Unlock with Biometrics" onPress={authenticate} />
        </View>
      )}
    </Fragment>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  unlockButton: {
    marginTop: "100%",
  },
});
