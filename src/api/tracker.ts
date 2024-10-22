import axios from "axios";
import { IGetTrackers } from "../types/tracker";

export function getTrackerData(sheet: string): Promise<IGetTrackers> {
  const params = {
    name: sheet,
  };
  return axios.get(
    "https://opm1scg391.execute-api.us-east-1.amazonaws.com/sheets"
  );
}

export function updateTrackerData(values: string[]) {
  return axios.put(`http://192.168.29.109:8082/sheets`, { values });
}
