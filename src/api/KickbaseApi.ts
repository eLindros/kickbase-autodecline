import axios, { Axios, AxiosInstance, AxiosRequestConfig } from 'axios';
import { Login, League, Leagues, Market, Players } from './interfaces';

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
  market?: Players[];
}

export const init = (): AxiosInstance => {
  return axios.create({
    baseURL: kickbaseApiUrls.base,
  });
};

const axiosCall = async <T>(
  axiosInstance: AxiosInstance,
  config: AxiosRequestConfig
): Promise<AxiosCallResponse<T>> => {
  try {
    const { data } = await axiosInstance.request<T>(config);
    return [null, data];
  } catch (error) {
    return [error, null];
  }
};

export const login = async (
  userName: string,
  password: string,
  axiosInstance: AxiosInstance
): Promise<AxiosInstance> => {
  const response = await axiosCall<Login>(axiosInstance, {
    url: kickbaseApiUrls.login,
    method: 'POST',
    data: {
      email: userName,
      password: password,
      ext: true,
    },
  });
  const [error, data] = response;
  if (error) console.log(error);
  if (data) {
    axiosInstance.defaults.headers.common[
      'Authorization'
    ] = `Bearer ${data.token}`;
  }
  return axiosInstance;
};

export const getLeagues = async (
  axiosInstance: AxiosInstance
): Promise<AxiosCallResponse<Leagues>> => {
  return axiosCall<Leagues>(axiosInstance, {
    url: kickbaseApiUrls.league,
    method: 'GET',
  });
};

export const getLeagueId = (
  leagueIndex: number,
  leagues: Leagues
): AxiosCallResponse<string> => {
  if (leagues && leagues.leagues && leagues.leagues.length >= leagueIndex) {
    return [null, leagues.leagues[leagueIndex].id];
  }
  return ['Error: Keine LeagueID gefunden.', null];
};

export const getMarket = async (
  axiosInstance: AxiosInstance,
  leagueId: string
): Promise<AxiosCallResponse<Market>> => {
  const marketUrl: string = `/leagues/${leagueId}${kickbaseApiUrls.market}`;
  return axiosCall<Market>(axiosInstance, {
    url: marketUrl,
    method: 'GET',
  });
};
