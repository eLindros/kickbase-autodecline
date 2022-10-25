import schedule from 'node-schedule';
import { timestamp } from './helpers';
import {
  setup,
  declineLowOffers,
  putAllPlayersOnMarket,
} from './kickbase-autodecline';
import {
  DATE_LOCALE,
  SCHEDULE_DECLINE_HOUR,
  SCHEDULE_DECLINE_MINUTE,
  SCHEDULE_ON_MARKET_MINUTE,
  TIME_ZONE,
} from './settings';

const ruleDeclineLowOffers = new schedule.RecurrenceRule();
ruleDeclineLowOffers.minute = SCHEDULE_DECLINE_MINUTE;
ruleDeclineLowOffers.hour = SCHEDULE_DECLINE_HOUR;
ruleDeclineLowOffers.tz = TIME_ZONE;

const rulePutAllOnMarket = new schedule.RecurrenceRule();
rulePutAllOnMarket.minute = SCHEDULE_ON_MARKET_MINUTE;
rulePutAllOnMarket.tz = TIME_ZONE;

export const scheduleAutoDecline = schedule.scheduleJob(
  ruleDeclineLowOffers,
  async () => {
    timestamp(DATE_LOCALE, TIME_ZONE);
    const response = await setup();
    if (response) {
      const { leagueId, userId } = response;
      declineLowOffers(leagueId, userId);
    }
  }
);

export const schedulePutOnMarket = schedule.scheduleJob(
  rulePutAllOnMarket,
  async () => {
    timestamp(DATE_LOCALE, TIME_ZONE);
    const response = await setup();
    if (response) {
      const { leagueId, userId } = response;
      putAllPlayersOnMarket(leagueId, userId);
    }
  }
);
