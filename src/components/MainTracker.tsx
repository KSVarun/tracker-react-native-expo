import { format } from "date-fns";
import { FC, useEffect, useState } from "react";
import {
  Button,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { greenColorPalette, redColorPalette } from "../constants/colorPalette";
import { IGetTrackers } from "../types/tracker";
import { updateTrackerData } from "../api/tracker";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Snackbar } from "react-native-paper";

interface IMainTracker {
  result: IGetTrackers;
  dataKeys: string[]; //these are the different behavior trackers, for example Meditation, Exercise etc
  handleForcedRefresh: () => void;
}

interface ILocalState {
  selectedDate: string;
  selectedDatesData: Record<string, string> | {} | null;
  refreshing: boolean;
  updateSnackbarMessage: string;
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
    updateSnackbarMessage: "",
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
              <View
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
              >
                <TouchableOpacity
                  style={styles.plusMinusBtn}
                  onPress={() => handleCardLongPress(key)}
                >
                  <Text style={styles.plusMinusText}>-</Text>
                </TouchableOpacity>
                <View style={styles.content}>
                  <Text>{key}</Text>
                  <Text>{localState.selectedDatesData[key] ?? ""}</Text>
                </View>
                <TouchableOpacity
                  style={styles.plusMinusBtn}
                  onPress={() => handleCardPress(key)}
                >
                  <Text style={styles.plusMinusText}>+</Text>
                </TouchableOpacity>
              </View>
            );
          })}
      </ScrollView>
      <TouchableOpacity
        style={styles.uploadBtn}
        onPress={() => {
          const requestData = [
            localState.selectedDate,
            ...Object.values(localState.selectedDatesData),
          ];
          updateTrackerData(requestData)
            .then(() => {
              updateState({
                ...localState,
                updateSnackbarMessage: "Update successful!",
              });
            })
            .catch((err) => {
              updateState({
                ...localState,
                updateSnackbarMessage: "Update failed!",
              });
            });
        }}
      >
        <Icon name="cloud-upload" size={40} color="#fff" />
      </TouchableOpacity>
      <Snackbar
        visible={Boolean(localState.updateSnackbarMessage)}
        onDismiss={() => {
          updateState({ ...localState, updateSnackbarMessage: "" });
        }}
        duration={3000}
      >
        {localState.updateSnackbarMessage}
      </Snackbar>
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
    padding: 10,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: "#00000",
    flexDirection: "row",
    width: "100%",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  lastCard: {
    marginBottom: 90,
  },
  happy: {
    backgroundColor: greenColorPalette.happy,
  },
  bad: {
    backgroundColor: redColorPalette.bad,
  },
  plusMinusBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  plusMinusText: {
    fontSize: 25,
  },
  uploadBtn: {
    position: "absolute",
    bottom: 10,
    right: 10,
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#007BFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
});
