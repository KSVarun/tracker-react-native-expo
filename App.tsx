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
import { GraphContainer } from "./src/components/GraphContainer";
import "react-native-reanimated";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

export default function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const loadFonts = async () => {
    await Font.loadAsync({
      "Lexend-VariableFont": require("./src/fonts/Lexend-VariableFont_wght.ttf"),
    });
    setFontsLoaded(true);
  };

  useEffect(() => {
    SplashScreen.preventAutoHideAsync(); // Prevent the splash screen from auto-hiding
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null; // Optionally, you can return a loading indicator here
  }

  SplashScreen.hideAsync(); // Hide the splash screen once fonts are loaded

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
            <GraphContainer />
            <StatusBar />
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
