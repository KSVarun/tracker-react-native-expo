import { TRACKER } from "../types/tracker";

export const maxTrackerThreshold: Record<TRACKER, number> = {
  MEDITATION: 6,
  FC: 0,
};

export const trackerIncrement: Record<TRACKER, number> = {
  MEDITATION: 6,
  FC: 1,
};
