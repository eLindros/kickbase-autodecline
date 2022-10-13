import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
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

export class KickbaseApi {
  private axiosInstance: AxiosInstance;

  token: string | null = null;
  data: KickbaseData = {
    leagues: undefined,
    market: undefined,
  };

  constructor(public userName: string, public password: string) {
    this.axiosInstance = axios.create({
      baseURL: kickbaseApiUrls.base,
    });
  }

  private async axiosCall<T>(
    config: AxiosRequestConfig
  ): Promise<AxiosCallResponse<T>> {
    try {
      const { data } = await this.axiosInstance.request<T>(config);
      return [null, data];
    } catch (error) {
      return [error, null];
    }
  }

  private async axiosCallAuth<
    T extends KickbaseApiResponses[keyof KickbaseApiResponses]
  >(config: AxiosRequestConfig): Promise<AxiosCallResponse<T>> {
    await this.authorize();
    return this.axiosCallAuth<T>(config);
  }

  private async login(): Promise<void> {
    return this.axiosCall<Login>({
      url: kickbaseApiUrls.login,
      method: 'POST',
      data: {
        email: this.userName,
        password: this.password,
        ext: true,
      },
    }).then((response: AxiosCallResponse<Login>) => {
      const [error, data] = response;
      if (error) console.log(error);
      if (data) this.token = data.token;
    });
  }

  private async authorize(): Promise<void> {
    if (!this.token) {
      await this.login();
    }
    this.axiosInstance.defaults.headers.common[
      'Authorization'
    ] = `Bearer ${this.token}`;
  }

  async getLeagues(): Promise<AxiosCallResponse<Leagues>> {
    return this.axiosCallAuth<Leagues>({
      url: kickbaseApiUrls.league,
      method: 'GET',
    }).then((response: AxiosCallResponse<Leagues>) => {
      const [error, data] = response;
      if (error) console.log(error);
      if (data && data.leagues) this.data.leagues = data.leagues;
      return response;
    });
  }

  async getLeagueId(leagueIndex: number): Promise<AxiosCallResponse<string>> {
    if (!this.data.leagues) await this.getLeagues();
    const leagues: League[] | undefined = this.data.leagues;
    if (leagues && leagues.length >= leagueIndex) {
      return [null, leagues[leagueIndex].id];
    }
    return ['Error: Keine LeagueID gefunden.', null];
  }

  async getMarket(): Promise<AxiosCallResponse<Market>> {
    const marketUrl: string = await `${this.getLeagueId(0)}${
      kickbaseApiUrls.market
    }`;
    return this.axiosCallAuth<Market>({
      url: marketUrl,
      method: 'GET',
    }).then((response: AxiosCallResponse<Market>) => {
      const [error, data] = response;
      if (error) console.log(error);
      if (data && data.players) this.data.market = data.players;
      return response;
    });
  }
}
