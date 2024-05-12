import { FC, useEffect, useState } from "react";
import { TRACKER, TRACKER_DATA } from "../types/tracker";
import { useGetTrackerData } from "../hooks/tracker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEY } from "../constants/global";

interface ITrackerLoader {
  trackers: TRACKER[];
  sheet: string;
  render: (
    data: TRACKER_DATA,
    dataKeys: TRACKER[],
    handleForcedRefresh: () => void
  ) => JSX.Element;
}

interface ILocalState {
  forcedRefresh: boolean;
}

export const TrackerLoader: FC<ITrackerLoader> = ({
  trackers,
  sheet,
  render,
}) => {
  const [localState, setLocalState] = useState<ILocalState>({
    forcedRefresh: false,
  });
  const getTrackerQuery = useGetTrackerData(
    trackers,
    sheet,
    localState.forcedRefresh
  );

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

  if (getTrackerQuery.isIdle || getTrackerQuery.isFetching) {
    return null;
  }

  if (getTrackerQuery.isError) {
    return null;
  }

  const jsonValue = JSON.stringify(getTrackerQuery.data.data.result);
  AsyncStorage.setItem(STORAGE_KEY, jsonValue).catch((err) => console.log(err));

  function handleForcedRefresh() {
    if (!localState.forcedRefresh) {
      setLocalState({ forcedRefresh: true });
    }
  }

  return render(
    getTrackerQuery.data.data.result,
    Object.keys(getTrackerQuery.data.data.result) as TRACKER[],
    handleForcedRefresh
  );
};
