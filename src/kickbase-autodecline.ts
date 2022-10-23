import { Market, MarketPlayer, Offer } from './api/interfaces';
import { Player } from './api/interfaces/Players';
import {
  init,
  login,
  getLeagueId,
  getMarket,
  getUserId,
} from './api/KickbaseApi';

type PlayerType = MarketPlayer | Player;

interface hasOffers {
  offers: Offer[];
}

// const filter =
//   <T>(predicate: (elem: T) => Boolean) =>
//   (array: T[]) =>
//     array.filter(predicate);

const hasUserId =
  (userId: string): ((player: PlayerType) => boolean) =>
  (player: PlayerType): boolean =>
    player.userId === userId;

const hasOffer = (player: MarketPlayer): boolean =>
  player.offers && player.offers.length > 0;

const isHighOffer =
  (
    offer_threshold: number
  ): ((player: MarketPlayer) => (offer: Offer) => boolean) =>
  (player: MarketPlayer): ((offer: Offer) => boolean) =>
  (offer: Offer): boolean =>
    offer.price / player.marketValue - 1 > offer_threshold;

const hasHighOffers =
  (offer_threshold: number): ((player: MarketPlayer) => boolean) =>
  (player: MarketPlayer): boolean => {
    const highOffers: Offer[] = player.offers.filter(
      isHighOffer(offer_threshold)(player)
    );
    if (highOffers.length == 0) {
      return true;
    } else {
      return false;
    }
  };

// get player with too too low offers
const getUsersPlayersWithTooLowOffers = (
  market: Market,
  userId: string,
  offer_threshold: number
): MarketPlayer[] => {
  if (market.players && market.players.length) {
    const players = market.players;
    const userPlayers = players.filter(hasUserId(userId));
    if (userPlayers.length) {
      const userPlayersWithOffers = userPlayers.filter(hasOffer);
      if (userPlayersWithOffers.length) {
        const userPlayersWithTooLowOffers = userPlayersWithOffers.filter(
          hasHighOffers(offer_threshold)
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
