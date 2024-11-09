import { AxiosError } from 'axios';
import { Market, MarketPlayer, Offer } from './api/interfaces';
import { Player } from './api/interfaces/Players';
import {
  init,
  login,
  getLeagueId,
  getMarket,
  getUserId,
  getBonusCollect,
  removePlayerFromMarket,
  getPlayers,
  putPlayerOnMarket,
} from './api/KickbaseApi';
import { KICKBASE_PASSWORD, KICKBASE_USER, OFFER_THRESHOLD } from './settings';

type PlayerType = MarketPlayer | Player;

interface hasOffers {
  offers: Offer[];
}

const hasUserId =
  (userId: string): ((player: PlayerType) => boolean) =>
  (player: PlayerType): boolean =>
    player.userId === userId;

const hasOffer = (player: MarketPlayer): boolean => {
  if (player.offers && player.offers.length > 0) {
    return true;
  }
  return false;
};

const isHighOffer =
  (
    offer_threshold: number
  ): ((player: MarketPlayer) => (offer: Offer) => boolean) =>
  (player: MarketPlayer): ((offer: Offer) => boolean) =>
  (offer: Offer): boolean =>
    offer.price / player.marketValue - 1 > offer_threshold;

const hasNoHighOffers =
  (offer_threshold: number): ((player: MarketPlayer) => boolean) =>
  (player: MarketPlayer): boolean => {
    if (player.offers) {
      const highOffers: Offer[] = player.offers.filter(
        isHighOffer(offer_threshold)(player)
      );
      if (highOffers.length == 0) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  };

const isNotExpiredOffer = (offer: Offer): boolean => {
  if (offer.validUntilDate) {
    const dateOfExpiration = new Date(offer.validUntilDate);
    const now = new Date();
    return dateOfExpiration > now;
  } else {
    return true;
  }
};

const hasOnlyExpiredOffers = (player: MarketPlayer): boolean => {
  if (player.offers) {
    const notExpiredOffers: Offer[] = player.offers.filter(isNotExpiredOffer);
    if (notExpiredOffers.length == 0) {
      return true;
    } else {
      return false;
    }
  }
  return false;
};

const hasTooLowOfferOrOnlyExpiredOffers =
  (offer_threshold: number): ((player: MarketPlayer) => boolean) =>
  (player: MarketPlayer): boolean => {
    if (
      hasNoHighOffers(offer_threshold)(player) ||
      hasOnlyExpiredOffers(player)
    ) {
      return true;
    }
    return false;
  };

// get player with too too low offers
const getUsersPlayersWithTooLowOrExpiredOffers = (
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
        const userPlayersWithTooLowOrExpiredOffers =
          userPlayersWithOffers.filter(
            hasTooLowOfferOrOnlyExpiredOffers(offer_threshold)
          );
        return userPlayersWithTooLowOrExpiredOffers;
      }
    }
  }
  return [];
};

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

// decline all too low offers and log about it
export const declineLowOffers = async (leagueId: string, userId: string) => {
  const [errorMarket, market] = await getMarket(leagueId);
  if (errorMarket) console.log(errorMarket);
  if (market && userId) {
    const offer_threshold = OFFER_THRESHOLD;
    const playersWithTooLowOffers = getUsersPlayersWithTooLowOrExpiredOffers(
      market,
      userId,
      offer_threshold / 100
    );
    if (playersWithTooLowOffers.length) {
      let i = 1;
      console.log(`The following players were removed from market:
      <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<`);
      playersWithTooLowOffers.forEach(async (player: MarketPlayer) => {
        const [error, response] = await removePlayerFromMarket(
          leagueId,
          player.id
        );
        if (error) {
          console.error(error);
        } else if (response?.errMsg) {
          console.error(response.errMsg);
        } else {
          console.log(`${i}. ${player.firstName} ${player.lastName}`);
        }
        i++;
        sleep(1000);
      });
    } else {
      console.log(`No players with too low offers left.`);
    }
  }
};

// put all players not currently on market on it and log about it
export const putAllPlayersOnMarket = async (
  leagueId: string,
  userId: string
) => {
  const [errorPlayers, players] = await getPlayers(leagueId, userId);
  if (errorPlayers) console.error(errorPlayers);
  if (players && players.players) {
    const playersNotOnMarket = players.players.filter(
      (player: Player): Boolean => ('price' in player ? false : true)
    );
    if (playersNotOnMarket.length) {
      let i = 1;
      console.log(`The following players were put on market:
      >>>>>>>>>>>>>>>>>>>>>>>>>>>`);
      playersNotOnMarket.forEach(async (player: Player) => {
        const [error, response] = await putPlayerOnMarket(
          leagueId,
          player.id,
          player.marketValue
        );
        if (error) {
          console.error(error);
        } else if (response?.errMsg) {
          console.error(response.errMsg);
        } else {
          console.log(`${i}. ${player.firstName} ${player.lastName}`);
        }
        i++;
        sleep(1000);
      });
    } else {
      console.log(`All players are already on market.`);
    }
  }
};

export const exportedForTesting = {
  hasOffer,
  isHighOffer,
  hasNoHighOffers,
  isNotExpiredOffer,
  hasOnlyExpiredOffers,
  hasTooLowOfferOrOnlyExpiredOffers,
  getUsersPlayersWithTooLowOrExpiredOffers,
};
