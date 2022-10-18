import {
  init,
  login,
  getLeagues,
  getLeagueId,
  getMarket,
} from './api/KickbaseApi';

// Login to Kickbase => Token

// Get all players with market values and offers

// calculate too low offers

// every hour: put all player without offer on market

// every hour: remove player with too low offer from market

export const autodecline = async () => {
  const user: string = process.env.KICKBASE_USER || 'none';
  const password: string = process.env.KICKBASE_PASSWORD || 'none';

  let axiosInstance = init();
  axiosInstance = await login(user, password, axiosInstance);

  const [errorLeagues, leagues] = await getLeagues(axiosInstance);
  if (errorLeagues) console.log(errorLeagues);
  if (leagues) {
    const [errorLeagueId, leagueId] = getLeagueId(0, leagues);
    if (errorLeagueId) console.log(errorLeagueId);
    if (leagueId) {
      const [errorMarket, market] = await getMarket(axiosInstance, leagueId);
      if (errorMarket) console.log(errorMarket);
      if (market) return market;
    }
  }
};
