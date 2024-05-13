import { format } from "date-fns";
import { FC, useEffect, useState } from "react";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";
import { greenColorPalette, redColorPalette } from "../constants/colorPalette";
import {
  maxTrackerThreshold,
  trackerIncrement,
} from "../constants/thresholdMapper";
import { TRACKER, TRACKER_DATA } from "../types/tracker";

interface IMainTracker {
  data: TRACKER_DATA;
  dataKeys: TRACKER[];
  handleForcedRefresh: () => void;
}

interface ILocalState {
  selectedDate: string;
  selectedDatesData: Record<TRACKER, string> | {} | null;
  refreshing: boolean;
}

const currentDate = format(new Date(), "dd/MM/yyyy");

export const MainTracker: FC<IMainTracker> = ({
  data,
  dataKeys,
  handleForcedRefresh,
}) => {
  const [localState, setLocalState] = useState<ILocalState>({
    selectedDate: currentDate,
    selectedDatesData: null,
    refreshing: false,
  });

  useEffect(() => {
    const updatedSelectedDatesData: Record<TRACKER, string[]> | {} = {};
    dataKeys.forEach((key: TRACKER) => {
      data[key].forEach((individualData) => {
        if (individualData[0] === currentDate) {
          updatedSelectedDatesData[key] = individualData[1] ?? "0";
        } else {
          updatedSelectedDatesData[key] = "0";
        }
      });
    });

    setLocalState((currentState) => ({
      ...currentState,
      selectedDatesData: updatedSelectedDatesData,
    }));
  }, [data, dataKeys]);

  function updateState(updatedState: ILocalState) {
    setLocalState(updatedState);
  }

  function onRefresh() {
    updateState({ ...localState, refreshing: true });
    handleForcedRefresh();
    setTimeout(() => {
      updateState({ ...localState, refreshing: false });
    }, 3000);
  }

  function handlePress(tracker: TRACKER) {
    const updatedState = { ...localState };
    updatedState.selectedDatesData[tracker] = `${
      Number(updatedState.selectedDatesData[tracker]) +
      trackerIncrement[tracker]
    }`;
    updateState(updatedState);
  }

  function handleLongPress(tracker: TRACKER) {
    const updatedState = { ...localState };
    if (Number(updatedState.selectedDatesData[tracker]) === 0) {
      return;
    }
    updatedState.selectedDatesData[tracker] = `${
      Number(updatedState.selectedDatesData[tracker]) -
      trackerIncrement[tracker]
    }`;
    updateState(updatedState);
  }

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollViewContent}
      refreshControl={
        <RefreshControl
          refreshing={localState.refreshing}
          onRefresh={onRefresh}
        />
      }
    >
      {localState.selectedDatesData &&
        dataKeys.map((key) => {
          return (
            <Pressable
              style={[
                styles.card,
                Number(localState.selectedDatesData[key]) ===
                maxTrackerThreshold[key]
                  ? styles.happy
                  : styles.bad,
                key !== "FC" &&
                Number(localState.selectedDatesData[key]) >
                  maxTrackerThreshold[key]
                  ? styles.happy
                  : null,
              ]}
              key={key}
              onPress={() => handlePress(key)}
              onLongPress={() => handleLongPress(key)}
            >
              <Text>{key}</Text>
              <Text>{localState.selectedDatesData[key] ?? ""}</Text>
            </Pressable>
          );
        })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
    height: "100%",
  },
  scrollViewContent: {
    height: "100%",
    justifyContent: "flex-end",
    gap: 10,
  },
  card: {
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: "#00000",
    flexDirection: "row",
    width: "100%",
  },
  happy: {
    backgroundColor: greenColorPalette.happy,
  },
  bad: {
    backgroundColor: redColorPalette.bad,
  },
});
