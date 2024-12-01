import {
  Button,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { QueryClient, QueryClientProvider } from "react-query";
import { Fragment, useEffect, useState } from "react";
import * as LocalAuthentication from "expo-local-authentication";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { Wrapper } from "./src/components/Wrapper";
import {
  registerForPushNotifications,
  registerForShowingNotificationWhenAppIsInTheForeground,
} from "./src/utils/notification";
import { enableScreens } from "react-native-screens";

enableScreens();

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

export default function App() {
  const [authenticated, setAuthenticated] = useState(true);

  useEffect(() => {
    registerForPushNotifications();
    registerForShowingNotificationWhenAppIsInTheForeground();
  }, []);

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
      <StatusBar
        hidden={false}
        barStyle="light-content" // Options: 'default', 'dark-content', 'light-content'
      />
      {authenticated ? (
        <QueryClientProvider client={queryClient}>
          <SafeAreaView style={styles.container}>
            <SafeAreaProvider>
              <NavigationContainer>
                <Wrapper />
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
    // paddingTop: 40,
  },
  unlockButton: {
    marginTop: "100%",
  },
});
