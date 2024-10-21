import axios from "axios";
import { IGetTrackers } from "../types/tracker";

export function getTrackerData(sheet: string): Promise<IGetTrackers> {
  const params = {
    name: sheet,
  };
  return axios.get(`http://192.168.29.109:8082/sheets`, { params });
}

export function updateTrackerData(values: string[]) {
  return axios.put(`http://192.168.29.109:8082/sheets`, { values });
}
