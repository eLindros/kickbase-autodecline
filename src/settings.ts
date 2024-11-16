import './env';

// Login credentials for Kickbase, don't write them here
export const KICKBASE_USER = process.env.KICKBASE_USER || 'none';
export const KICKBASE_PASSWORD = process.env.KICKBASE_PASSWORD || 'none';

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
