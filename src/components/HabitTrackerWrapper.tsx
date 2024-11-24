import type { FC } from "react";
import { TrackerLoader } from "../dataLoaders/TrackerLoader";
import { MainTracker } from "./MainTracker";
interface IHabitTrackerWrapperProps {}

export const HabitTrackerWrapper: FC<IHabitTrackerWrapperProps> = () => {
  return (
    <TrackerLoader
      sheet="DailyTrack"
      render={(result, dataKeys, handleForcedRefresh) => (
        <MainTracker
          result={result}
          dataKeys={dataKeys}
          handleForcedRefresh={handleForcedRefresh}
        />
      )}
    />
  );
};
