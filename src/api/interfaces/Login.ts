import { League } from './Leagues';

export interface Login {
  user: User;
  leagues: League[];
  svcs: SVCS[];
  token: string;
  tokenExp: string;
  ctoken: string;
  ctokenExp: string;
  err: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  birthday: string;
  notifications: number;
  gender: number;
  facebookId: string;
  profile: string;
  cover: string;
  flags: number;
  proExpiry: string;
  enableBeta: boolean;
  perms: number[];
}

export interface LeagueUserStandig {
  budget: number;
  teamValue: number;
  placement: number;
  points: number;
  ttm: number;
  cm: number;
  flags: number;
  se: boolean;
  nt: boolean;
  ntv: number;
  nb: number;
  ga: boolean;
  un: number;
}

interface SVCS {
  sk: string;
  t: string;
  st: string;
}
