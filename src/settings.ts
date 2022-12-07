import './env';
import schedule from 'node-schedule';

// Login credentials for Kickbase, don't write them here
export const KICKBASE_USER = process.env.KICKBASE_USER || 'none';
export const KICKBASE_PASSWORD = process.env.KICKBASE_PASSWORD || 'none';

// Threshold which determines what offer is too low
// 0.6 means: offers lower than 0.6 Percent above market value got declined
export const OFFER_THRESHOLD = process.env.OFFER_THRESHOLD
  ? parseFloat(process.env.OFFER_THRESHOLD)
  : 0.6;

// PORT to listen too
export const PORT = process.env.PORT ? parseFloat(process.env.PORT) : 3000;

// Configure the schedules
// Which time zone should the schedule be on?
// This is important, if you don't want to decline every hour
export const TIME_ZONE = 'Europe/Berlin';
// Locale for logging the timestamps
export const DATE_LOCALE = 'de-DE';

// Which minute of which hour shall the bonus get be collected?
export const SCHEDULE_GET_BONUS_MINUTE = 30;
export const SCHEDULE_GET_BONUS_HOUR = 6;

// Which minute of the hours shall the decline happen?
export const SCHEDULE_DECLINE_MINUTE = 0;

// Which hours a day shall the decline happen?
// Here is from 23:00 till 20:00 and not at 21:00 and 22:00
export const SCHEDULE_DECLINE_HOUR = [new schedule.Range(0, 20), 23];

// Which minute of the hours shall all players bet put on market again?
// Usually there is no reason to not want to put all players on the market
// The minute should be after the decline schedule
export const SCHEDULE_ON_MARKET_MINUTE = SCHEDULE_DECLINE_MINUTE + 2;
