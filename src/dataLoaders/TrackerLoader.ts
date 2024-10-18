import { FC, useEffect, useState } from "react";
import { IResult, RESPONSE_DATA } from "../types/tracker";
import { useGetTrackerData } from "../hooks/tracker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEY } from "../constants/global";

interface ITrackerLoader {
  sheet: string;
  render: (
    result: IResult,
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

  if (getTrackerQuery.isIdle || getTrackerQuery.isFetching) {
    return null;
  }

  if (getTrackerQuery.isError) {
    return null;
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

  const dataKeys = getDataKeys(getTrackerQuery.data.data.result.track);

  return render(
    getTrackerQuery.data.data.result,
    dataKeys,
    handleForcedRefresh
  );
};
