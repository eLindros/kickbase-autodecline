import schedule from 'node-schedule';
import { timestamp } from './helpers';
import { setup, collectBonus } from './kickbase-autodecline';
import {
  DATE_LOCALE,
  SCHEDULE_GET_BONUS_MINUTE,
  SCHEDULE_GET_BONUS_HOUR,
  TIME_ZONE,
} from './settings';

const ruleGetBonus = new schedule.RecurrenceRule();
ruleGetBonus.minute = SCHEDULE_GET_BONUS_MINUTE;
ruleGetBonus.hour = SCHEDULE_GET_BONUS_HOUR;
ruleGetBonus.tz = TIME_ZONE;

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
