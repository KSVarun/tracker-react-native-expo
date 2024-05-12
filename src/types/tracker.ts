export type TRACKER = "MEDITATION" | "FC";

export interface IGetTrackers {
  result: TRACKER_DATA;
}

export type TRACKER_DATA = Record<TRACKER, [[string, string]]>;
