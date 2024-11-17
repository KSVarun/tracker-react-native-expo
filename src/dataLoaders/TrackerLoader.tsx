import { FC, useEffect, useState } from "react";
import { IGetTrackers, RESPONSE_DATA } from "../types/tracker";
import { useGetTrackerData } from "../hooks/tracker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEY } from "../constants/global";
import { TrackerLoaderSkeleton } from "../skeletalLoaders/TrackerLoaderSkeleton";
import { Snackbar } from "react-native-paper";

interface ITrackerLoader {
  sheet: string;
  render: (
    result: IGetTrackers,
    dataKeys: string[],
    handleForcedRefresh: () => void
  ) => JSX.Element;
}

interface ILocalState {
  forcedRefresh: boolean;
}

export const TrackerLoader: FC<ITrackerLoader> = ({ sheet, render }) => {
  const [localState, setLocalState] = useState<ILocalState>({
    forcedRefresh: false,
  });
  const getTrackerQuery = useGetTrackerData(sheet, localState.forcedRefresh);

  useEffect(() => {
    if (!getTrackerQuery.isFetching) {
      setLocalState((currentState) => {
        if (currentState.forcedRefresh) {
          return { forcedRefresh: false };
        }
        return currentState;
      });
    }
  }, [getTrackerQuery.isFetching]);

  if (getTrackerQuery.isIdle || getTrackerQuery.isLoading) {
    return <TrackerLoaderSkeleton />;
  }

  if (getTrackerQuery.isError) {
    return (
      <Snackbar
        visible={true}
        onDismiss={() => {}}
        duration={3000}
        action={{
          label: "Fetch failed! Retry",
          onPress: () => {
            // Do something when 'Undo' is pressed
            getTrackerQuery.refetch();
          },
        }}
      >
        This is a Snackbar!
      </Snackbar>
    );
  }

  function handleForcedRefresh() {
    if (!localState.forcedRefresh) {
      setLocalState({ forcedRefresh: true });
    }
  }

  function getDataKeys(result: RESPONSE_DATA) {
    const dates = Object.keys(result);
    return Object.keys(result[dates[0]]);
  }

  const dataKeys = getDataKeys(getTrackerQuery.data.data.track);

  return render(getTrackerQuery.data.data, dataKeys, handleForcedRefresh);
};
