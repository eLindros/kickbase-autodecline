import { PlayerPosition, PlayerStatus } from './Players';

export interface Market {
  c: boolean; // ??
  players: MarketPlayer[];
}

export interface MarketPlayer {
  id: string; // id of the player
  teamId: string; // id of the players team
  userId: string; // id of the user who owns this player
  userProfile: string; // url of the users pic
  username: string; // name of the user
  firstName: string; // first name of the player
  lastName: string; // last name of the player
  profile: string; // url of the players pic
  status: PlayerStatus; // status of the player like 'fit', 'injured' etc.
  position: PlayerPosition; // position of the player like 'defender', 'goalkeeper' etc.
  number: number; // trikot number of the player
  totalPoints: number;
  averagePoints: number; // total points / games played
  marketValue: number; // current market value
  price: number; // price which the user wants for the player
  date: string; // time when the player was put on the market
  expiry: number; // ?? number in seconds till the player is on the market
  offers: Offer[];
  lus: number; // ??
  marketValueTrend: number; // 2
}

export interface Offer {
  id: string; // ?? id of the offer
  userId?: string; // id of the user who made this offer
  userName?: string; // name of this user
  userProfileUrl?: string; // url of this users pic
  price: number; // amount of the offer
  date: string; // date string when the offer was made
  validUntilDate?: string; // date string when the offer will expire
  status?: number; // ?
}
