import { TRACKER } from "../types/tracker";

export const maxTrackerThreshold: Record<TRACKER, number> = {
  MEDITATION: 6,
  FC: 0,
  CARROT: 2,
  BEETROOT: 1,
};

export const trackerIncrement: Record<TRACKER, number> = {
  MEDITATION: 6,
  FC: 1,
  CARROT: 1,
  BEETROOT: 1,
};
