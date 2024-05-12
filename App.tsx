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
          trackers={["FC", "MEDITATION"]}
          sheet="DailyTrack"
          render={(data, dataKeys, handleForcedRefresh) => (
            <MainTracker
              data={data}
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
