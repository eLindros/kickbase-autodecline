import { AxiosError } from 'axios';
import {
  init,
  login,
  getLeagueId,
  getUserId,
  getBonusCollect,
} from './api/KickbaseApi';
import { KICKBASE_PASSWORD, KICKBASE_USER } from './settings';

const sleep = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

export const setup = async (): Promise<
  { leagueId: string; userId: string } | undefined
> => {
  // Login to Kickbase => Token
  const user: string = KICKBASE_USER;
  const password: string = KICKBASE_PASSWORD;

  init();
  const [loginError, loginData] = await login(user, password);
  if (loginError) console.error(loginError);

  // Get all leagueId and userId
  if (loginData) {
    const [errorLeagueId, leagueId] = getLeagueId(0, loginData);
    const [errorUserId, userId] = getUserId(loginData);
    if (errorLeagueId) console.error(errorLeagueId);
    if (errorUserId) console.error(errorUserId);
    if (leagueId && userId) return { leagueId, userId };
    return undefined;
  }
};

// collects the daily bonus
export const collectBonus = async (leagueId: string) => {
  const [error, data] = await getBonusCollect();
  if (data) {
    console.log('Bonus successfully collected');
  }
  if (error) {
    const err = error as AxiosError;
    console.error(err.response?.data);
  } else {
    console.error(error);
  }
};
