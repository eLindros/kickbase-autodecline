import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { Login, Leagues, Market } from './interfaces';

enum kickbaseApiUrls {
  base = 'https://api.kickbase.com',
  login = '/user/login',
  league = '/leagues',
  market = '/market',
}

type AxiosCallResponse<T> = [unknown | null, T | null];

interface KickbaseData {
  leagues?: Leagues;
  market?: Market;
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

  private async axiosCallPlain<T>(
    config: AxiosRequestConfig
  ): Promise<AxiosCallResponse<T>> {
    try {
      const { data } = await this.axiosInstance.request<T>(config);
      return [null, data];
    } catch (error) {
      return [error, null];
    }
  }

  private async axiosCall<T extends KickbaseData[keyof KickbaseData]>(
    config: AxiosRequestConfig,
    parameter: keyof KickbaseData
  ): Promise<AxiosCallResponse<T>> {
    await this.authorize();
    return this.axiosCallPlain<T>(config).then(
      (response: AxiosCallResponse<T>) => {
        const [error, data] = response;
        if (error) console.log(error);
        if (data) this.data[parameter] = data;
        return response;
      }
    );
  }

  private async login(): Promise<void> {
    return this.axiosCallPlain<Login>({
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
    await this.authorize();
    return this.axiosCall<Leagues>(
      {
        url: kickbaseApiUrls.league,
        method: 'GET',
      },
      'leagues'
    );
  }

  async getMarket(): Promise<AxiosCallResponse<Market>> {
    await this.authorize();
    return this.axiosCall<Market>(
      {
        url: kickbaseApiUrls.market,
        method: 'GET',
      },
      'market'
    );
  }
}
