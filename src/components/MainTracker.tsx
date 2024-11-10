import { format } from "date-fns";
import { FC, useEffect, useState } from "react";
import {
  Button,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { greenColorPalette, redColorPalette } from "../constants/colorPalette";
import { IGetTrackers } from "../types/tracker";
import { updateTrackerData } from "../api/tracker";

interface IMainTracker {
  result: IGetTrackers;
  dataKeys: string[]; //these are the different behavior trackers, for example Meditation, Exercise etc
  handleForcedRefresh: () => void;
}

interface ILocalState {
  selectedDate: string;
  selectedDatesData: Record<string, string> | {} | null;
  refreshing: boolean;
  bottomDrawerExpanded: boolean;
}

const currentDate = format(new Date(), "dd/MM/yyyy");

export const MainTracker: FC<IMainTracker> = ({
  result,
  dataKeys,
  handleForcedRefresh,
}) => {
  const [localState, setLocalState] = useState<ILocalState>({
    selectedDate: currentDate,
    selectedDatesData: null,
    refreshing: false,
    bottomDrawerExpanded: false,
  });
  const configurations = result.configurations;

  useEffect(() => {
    const updatedSelectedDatesData: Record<string, string[]> | {} = {};
    dataKeys.forEach((key: string) => {
      if (result.track[currentDate]) {
        updatedSelectedDatesData[key] = result.track[currentDate][key];
      } else {
        updatedSelectedDatesData[key] = "0";
      }
    });

    setLocalState((currentState) => ({
      ...currentState,
      selectedDatesData: updatedSelectedDatesData,
    }));
  }, [result, dataKeys]);

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

  function handleCardPress(tracker: string) {
    const updatedState = { ...localState };
    updatedState.selectedDatesData[tracker] = `${
      Number(updatedState.selectedDatesData[tracker]) +
      Number(configurations[tracker]["threshold-increment"])
    }`;
    updateState(updatedState);
  }

  function handleCardLongPress(tracker: string) {
    const updatedState = { ...localState };
    if (Number(updatedState.selectedDatesData[tracker]) === 0) {
      return;
    }
    updatedState.selectedDatesData[tracker] = `${
      Number(updatedState.selectedDatesData[tracker]) -
      Number(configurations[tracker]["threshold-increment"])
    }`;
    updateState(updatedState);
  }

  return (
    <View style={styles.wrapper}>
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
          dataKeys.map((key, index) => {
            const isLastCard = index === dataKeys.length - 1;
            return (
              <Pressable
                style={[
                  styles.card,
                  Number(localState.selectedDatesData[key]) ===
                  Number(configurations[key]["max-threshold-value"])
                    ? styles.happy
                    : styles.bad,
                  key !== "FC" &&
                  Number(localState.selectedDatesData[key]) >
                    Number(configurations[key]["max-threshold-value"])
                    ? styles.happy
                    : null,
                  isLastCard && styles.lastCard,
                ]}
                key={key}
                onPress={() => handleCardPress(key)}
                onLongPress={() => handleCardLongPress(key)}
              >
                <Text>{key}</Text>
                <Text>{localState.selectedDatesData[key] ?? ""}</Text>
              </Pressable>
            );
          })}
      </ScrollView>
      <Pressable
        onPress={() => {
          updateState({
            ...localState,
            bottomDrawerExpanded: !localState.bottomDrawerExpanded,
          });
        }}
      >
        <View
          style={[
            styles.bottomDrawer,
            localState.bottomDrawerExpanded && styles.bottomDrawerExpanded,
          ]}
        >
          <Button
            title="Update"
            onPress={() => {
              const requestData = [
                localState.selectedDate,
                ...Object.values(localState.selectedDatesData),
              ];
              updateTrackerData(requestData)
                .then(() => {})
                .catch((err) => console.log(err));
            }}
          />
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  scrollViewContent: {
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
  lastCard: {
    marginBottom: 30,
  },
  happy: {
    backgroundColor: greenColorPalette.happy,
  },
  bad: {
    backgroundColor: redColorPalette.bad,
  },
  bottomDrawer: {
    position: "absolute",
    bottom: 0,
    backgroundColor: "grey",
    height: 55,
    transform: [{ translateY: 40 }],
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  bottomDrawerExpanded: {
    transform: [{ translateY: 0 }],
  },
  updateBtn: {
    width: "20%",
  },
});
