import axios, { Axios, AxiosInstance, AxiosRequestConfig } from 'axios';
import {
  Login,
  League,
  Leagues,
  Market,
  MarketPlayer,
  Players,
  Player,
  User,
} from './interfaces';

enum kickbaseApiUrls {
  base = 'https://api.kickbase.com',
  login = '/user/login',
  league = '/leagues',
  market = '/market',
}

type AxiosCallResponse<T> = [unknown | null, T | null];

interface KickbaseApiResponses {
  leagues?: Leagues;
  market?: Market;
}

interface KickbaseData {
  leagues?: League[];
  market?: MarketPlayer[];
}

interface KickbaseError {
  err: number;
  errMsg?: string;
}

export const init = (): void => {
  axios.defaults.baseURL = kickbaseApiUrls.base;
};

const axiosCall = async <T>(
  config: AxiosRequestConfig
): Promise<AxiosCallResponse<T>> => {
  try {
    const { data } = await axios.request<T>(config);
    return [null, data];
  } catch (error) {
    return [error, null];
  }
};

export const login = async (
  userName: string,
  password: string
): Promise<AxiosCallResponse<Login>> => {
  const response = await axiosCall<Login>({
    url: kickbaseApiUrls.login,
    method: 'POST',
    data: {
      email: userName,
      password: password,
      ext: true,
    },
  });
  const [error, data] = response;
  if (data) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
  }
  return response;
};

export const getLeagueId = (
  leagueIndex: number,
  login: Login
): AxiosCallResponse<string> => {
  if (login.leagues && login.leagues.length >= leagueIndex) {
    return [null, login.leagues[leagueIndex].id];
  }
  return ['Error: Keine LeagueId gefunden.', null];
};

export const getUserId = (login: Login): AxiosCallResponse<string> => {
  if (login.user && login.user.id) {
    return [null, login.user.id];
  }
  return ['Error: Keine UserId gefunden.', null];
};

export const getMarket = async (
  leagueId: string
): Promise<AxiosCallResponse<Market>> => {
  const marketUrl: string = `/leagues/${leagueId}${kickbaseApiUrls.market}`;
  return axiosCall<Market>({
    url: marketUrl,
    method: 'GET',
  });
};

export const getPlayers = async (
  leagueId: string,
  userId: string
): Promise<AxiosCallResponse<Players>> => {
  const playersURL: string = `/leagues/${leagueId}/users/${userId}/players`;
  return axiosCall<Players>({
    url: playersURL,
    method: 'GET',
  });
};

export const putPlayerOnMarket = async (
  leagueId: string,
  playerId: string,
  price: number
): Promise<AxiosCallResponse<KickbaseError>> => {
  const marketUrl: string = `/leagues/${leagueId}${kickbaseApiUrls.market}`;
  return axiosCall<KickbaseError>({
    url: marketUrl,
    method: 'POST',
    data: {
      playerId,
      price,
    },
  });
};

export const removePlayerFromMarket = async (
  leagueId: string,
  playerId: string
): Promise<AxiosCallResponse<KickbaseError>> => {
  const marketUrl: string = `/leagues/${leagueId}${kickbaseApiUrls.market}/${playerId}`;
  return axiosCall<KickbaseError>({
    url: marketUrl,
    method: 'DELETE',
  });
};
