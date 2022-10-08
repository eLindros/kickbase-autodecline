import { Handler } from "@netlify/functions";
import axios from "axios";
import { KickbaseLogin } from "../classes/Login";

// Login to Kickbase => Token
const getFirstLeagueId = async (): Promise<string> => {
  return axios({
    url: "https://api.kickbase.com/leagues",
    method: "GET",
  }).then(
    (response) => {
      if (response.status === 200) {
        if (
          response.data &&
          response.data.leagues &&
          response.data.leagues.length
        ) {
          return response.data.leagues[0].id || "no league id";
        } else {
          return "no league";
        }
      } else {
        return "Error. Response status: " + response.status;
      }
    },
    (error) => "Error: " + error
  );
};

// Get all players with market values and offers

// calculate too low offers

// every hour: put all player without offer on market

// every hour: remove player with too low offer from market

const handler: Handler = async () => {

const user: string = process.env.KICKBASE_USER || 'none';
const password: string = process.env.KICKBASE_PASSWORD || 'none';

  const login = new KickbaseLogin(
    "https://api.kickbase.com/user/login",
    user,
    password,
  );
  await login.login();
  const Token = login.token;
  axios.defaults.headers.common["Authorization"] = Token;
  console.log(await getFirstLeagueId());

  return {
    statusCode: 300,
  };
};

export { handler };
