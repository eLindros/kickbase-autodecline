import axios, { Axios, AxiosInstance, AxiosRequestConfig } from 'axios';
import { BonusCollect, Login, League, Leagues, User } from './interfaces';

enum kickbaseApiUrls {
  base = 'https://api.kickbase.com/v4',
  login = '/user/login',
  bonus = '/bonus/collect',
}

type AxiosCallResponse<T> = [unknown | null, T | null];

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
      em: userName,
      pass: password,
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

export const getBonusCollect = async (): Promise<
  AxiosCallResponse<BonusCollect>
> => {
  const url: string = kickbaseApiUrls.bonus;
  return axiosCall<BonusCollect>({
    url: url,
    method: 'GET',
  });
};
