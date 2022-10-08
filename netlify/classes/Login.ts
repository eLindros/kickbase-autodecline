import axios, { AxiosError, AxiosResponse } from "axios";

export class KickbaseLogin {
  response: AxiosResponse | null = null;
  error: AxiosError | null = null;

  get token(): string {
    if (this.response && this.wasSuccessful) {
      return "Bearer " + this.response.data.token;
    } else {
      return "Login has failed";
    }
  }

  get tokenExp(): string {
    if (this.response && this.wasSuccessful) {
      return this.response.data.tokenExp;
    } else {
      return "Login has failed";
    }
  }
  get wasSuccessful(): Boolean {
    if (
      this.response &&
      this.response.status === 200 &&
      this.response.data.token &&
      this.response.data.tokenExp
    ) {
      return true;
    } else {
      return false;
    }
  }

  constructor(
    public url: string,
    public user: string,
    public password: string
  ) {}

  async login(): Promise<boolean> {
    return axios({
      url: this.url,
      method: "POST",
      data: {
        email: this.user,
        password: this.password,
        ext: true,
      },
    })
      .then(
        (response: AxiosResponse): boolean => {
          this.response = response;
          return true;
        },
        (error: AxiosError): boolean => {
          this.error = error;
          return false;
        }
      );
  }
}
