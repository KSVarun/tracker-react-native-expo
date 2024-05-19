export interface IGetTrackers {
  result: { track: RESPONSE_DATA; configurations: RESPONSE_DATA };
}

export type RESPONSE_DATA = Record<string, Record<string, number>>;
