export interface Leagues {
  leagues: League[];
  err: number;
}

export interface League {
  id: string; // League id: '105146'
  cpi: string; // ??
  name: string; // '1. DEUTSCHE FANTASYLIGA'
  creator: string; // Username of creator
  creatorId: string; // id of creator
  creation: string; // Time of Creation Date as string '2022-07-22T12:00:54Z'
  ai: number; // ?? 1
  t: number; // ?? 43988
  au: number; // count of actual users in league 12
  mu: number; // max count of users in league 18
  ap: number; // ?? 6860
  pub: boolean; // is league public
  gm: number; // ?? 1
  mpl: boolean; // ?? true
  pl: number; // ?? 18
  ci: string; // URL to league image 'https://kickbase.b-cdn.net/league/7ccb5e2ce8d843dab80157d4445510a8.jpeg';
  amd: boolean; // ?? false
  mpst: number; // ?? 3
}
