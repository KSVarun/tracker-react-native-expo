export interface IGetTrackers {
  result: IResult;
}

export type IResult = {
  track: RESPONSE_DATA;
  configurations: Record<string, Record<CONFIG_KEYS, number>>;
};

export type RESPONSE_DATA = Record<string, Record<string, number>>;

export type CONFIG_KEYS = "max-threshold-value" | "threshold-increment";
