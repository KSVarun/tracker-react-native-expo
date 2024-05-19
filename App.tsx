import { SafeAreaView, StatusBar, StyleSheet } from "react-native";
import { QueryClient, QueryClientProvider } from "react-query";
import { MainTracker } from "./src/components/MainTracker";
import { TrackerLoader } from "./src/dataLoaders/TrackerLoader";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaView style={styles.container}>
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
        <StatusBar />
      </SafeAreaView>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
