export interface Players {
  players: Player[];
  err: number;
}

export interface Player {
  id: string;
  teamId: string;
  teamName: string;
  teamSymbol: string;
  userId: string;
  firstName: string;
  lastName: string;
  profile: string;
  profileBig: string;
  team: string;
  teamCover: string;
  status: PlayerStatus;
  position: PlayerPosition;
  averagePoints: number;
  totalPoints: number;
  marketValue: number;
  marketValueTrend: number;
  dayStatus: number;
  price?: number; // only if on market
}

export enum PlayerStatus {
  fit = 0,
  injured = 1,
  stricken = 2,
  'recover training' = 4,
  'red card' = 8,
  'second yellow card' = 16,
  'red and yellow card' = 32,
  'not in team' = 64,
  'left the league' = 128,
  'away' = 256,
}

export enum PlayerPosition {
  goalkeeper = 1,
  defender = 2,
  midfielder = 3,
  forward = 4,
}
