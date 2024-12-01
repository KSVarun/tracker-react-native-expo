import { intervalToDuration } from "date-fns";

function getTwoDigits(value: string) {
  if (value.length === 1) {
    return `0${value}`;
  }
  return value;
}

export function getTimeToRenderFromMilliSeconds(milliSeconds: number) {
  const durationObj = intervalToDuration({
    start: 0,
    end: milliSeconds,
  });
  return `${getTwoDigits(durationObj.hours?.toString() ?? "00")}:${getTwoDigits(
    durationObj.minutes?.toString() ?? "00"
  )}:${getTwoDigits(durationObj.seconds?.toString() ?? "00")}`;
}
