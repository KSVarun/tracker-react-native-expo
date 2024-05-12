import axios from "axios";
import { IGetTrackers, TRACKER } from "../types/tracker";

export function getTrackerData(
  trackers: TRACKER[],
  sheet: string
): Promise<IGetTrackers> {
  const params = {
    name: sheet,
    usage: trackers.join(","),
  };
  return axios.get(`http://192.168.29.109:8082/sheets`, { params });
}
