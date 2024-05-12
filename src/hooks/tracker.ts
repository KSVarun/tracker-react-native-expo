import { AxiosResponse, AxiosError } from "axios";
import { IGetTrackers, TRACKER } from "../types/tracker";
import { UseQueryResult, useQuery } from "react-query";
import { getTrackerData } from "../api/tracker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEY } from "../constants/global";

export const useGetTrackerData = (
  tracker: TRACKER[],
  sheet: string,
  forcedRefresh: boolean
): UseQueryResult<AxiosResponse<IGetTrackers>, AxiosError<{}>> => {
  return useQuery(
    ["tracker", tracker, sheet, forcedRefresh],
    async () => {
      if (forcedRefresh) {
        return getTrackerData(tracker, sheet);
      }
      const data = await getData();
      if (data && !forcedRefresh) {
        return { data: { result: data } };
      }
      return getTrackerData(tracker, sheet);
    },
    {
      keepPreviousData: true,
      onError(err) {},
    }
  );
};

const getData = async () => {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEY);
    if (value !== null) {
      return JSON.parse(value);
    }
    return null;
  } catch (e) {
    console.log(e);
  }
};
