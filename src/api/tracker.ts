import axios from "axios";
import { IGetTrackers } from "../types/tracker";

export function getTrackerData(sheet: string): Promise<IGetTrackers> {
  const params = {
    name: sheet,
  };
  return axios.get(`http://192.168.0.107:8082/sheets`, { params });
}
