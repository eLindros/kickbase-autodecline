export interface Settings {
  OFFER_THRESHOLD: number;
}

export const Settings: Settings = {
  OFFER_THRESHOLD: process.env.OFFER_THRESHOLD
    ? parseFloat(process.env.OFFER_THRESHOLD)
    : 0.6,
};
