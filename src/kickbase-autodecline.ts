import { Market, MarketPlayer, Offers } from './api/interfaces';
import {
  init,
  login,
  getLeagueId,
  getMarket,
  getUserId,
} from './api/KickbaseApi';

// calculate too low offers
const getUsersPlayersWithTooLowOffers = (
  market: Market,
  userId: string,
  offer_threshold: number
): MarketPlayer[] => {
  if (market.players && market.players.length) {
    const players = market.players;
    const userPlayers = players.filter(
      (player: MarketPlayer): Boolean => player.userId === userId
    );
    if (userPlayers.length) {
      const userPlayersWithOffers = userPlayers.filter(
        (player: MarketPlayer): Boolean =>
          player.offers && player.offers.length > 0
      );
      if (userPlayersWithOffers.length) {
        const userPlayersWithTooLowOffers = userPlayersWithOffers.filter(
          (player: MarketPlayer): Boolean => {
            const highOffers: Offers[] = player.offers.filter(
              (offer: Offers): boolean => {
                return offer.price / player.marketValue - 1 > offer_threshold;
              }
            );
            if (highOffers.length == 0) {
              return true;
            } else {
              return false;
            }
          }
        );

        return userPlayersWithTooLowOffers;
      }
    }
  }
  return [];
};

// every hour: put all player without offer on market

// every hour: remove player with too low offer from market

export const autodecline = async () => {
  // Login to Kickbase => Token
  const user: string = process.env.KICKBASE_USER || 'none';
  const password: string = process.env.KICKBASE_PASSWORD || 'none';

  init();
  const [loginError, loginData] = await login(user, password);

  // Get all players with market values and offers
  if (loginData) {
    const [errorLeagueId, leagueId] = getLeagueId(0, loginData);
    const [errorUserId, userId] = getUserId(loginData);
    if (errorLeagueId) console.log(errorLeagueId);
    if (leagueId) {
      const [errorMarket, market] = await getMarket(leagueId);
      if (errorMarket) console.log(errorMarket);
      if (market && userId) {
        return getUsersPlayersWithTooLowOffers(market, userId, 0.6 / 100);
      }
    }
  }
};
