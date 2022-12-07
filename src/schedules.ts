import schedule from 'node-schedule';
import { timestamp } from './helpers';
import {
  setup,
  collectBonus,
  declineLowOffers,
  putAllPlayersOnMarket,
} from './kickbase-autodecline';
import {
  DATE_LOCALE,
  SCHEDULE_GET_BONUS_MINUTE,
  SCHEDULE_GET_BONUS_HOUR,
  SCHEDULE_DECLINE_HOUR,
  SCHEDULE_DECLINE_MINUTE,
  SCHEDULE_ON_MARKET_MINUTE,
  TIME_ZONE,
} from './settings';

const ruleGetBonus = new schedule.RecurrenceRule();
ruleGetBonus.minute = SCHEDULE_GET_BONUS_MINUTE;
ruleGetBonus.hour = SCHEDULE_GET_BONUS_HOUR;
ruleGetBonus.tz = TIME_ZONE;

const ruleDeclineLowOffers = new schedule.RecurrenceRule();
ruleDeclineLowOffers.minute = SCHEDULE_DECLINE_MINUTE;
ruleDeclineLowOffers.hour = SCHEDULE_DECLINE_HOUR;
ruleDeclineLowOffers.tz = TIME_ZONE;

const rulePutAllOnMarket = new schedule.RecurrenceRule();
rulePutAllOnMarket.minute = SCHEDULE_ON_MARKET_MINUTE;
rulePutAllOnMarket.tz = TIME_ZONE;

export const scheduleBonusCollection = schedule.scheduleJob(
  ruleGetBonus,
  async () => {
    timestamp(DATE_LOCALE, TIME_ZONE);
    const response = await setup();
    if (response) {
      const { leagueId } = response;
      collectBonus(leagueId);
    }
  }
);

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
