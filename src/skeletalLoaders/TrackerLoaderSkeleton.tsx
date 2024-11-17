import type { FC } from "react";
import { View, StyleSheet } from "react-native";

interface ITrackerLoaderSkeletonProps {}

export const TrackerLoaderSkeleton: FC<ITrackerLoaderSkeletonProps> = () => {
  return (
    <View style={styles.container}>
      <View style={styles.card}></View>
      <View style={styles.card}></View>
      <View style={styles.card}></View>
      <View style={styles.card}></View>
      <View style={styles.card}></View>
      <View style={styles.card}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 10, gap: 10 },
  card: {
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: "#00000",
    flexDirection: "row",
    width: "100%",
    backgroundColor: "gray",
    height: 60,
  },
});
