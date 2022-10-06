import { Handler } from "@netlify/functions";
import axios, { AxiosPromise } from "axios";

// Login to Kickbase => Token
const login = async (): AxiosPromise => {
  return await axios({
    url: "https://api.kickbase.com/user/login",
    method: "POST",
    data: {
      email: process.env.USER,
      password: process.env.PASSWORD,
      ext: true,
    },
  });
};

const getToken = async (): Promise<string> => {
  return login().then(
    (response: any) => {
      if (response.status === 200) {
        if (response.data.token && response.data.tokenExp) {
          return "Bearer " + response.data.token;
          // localStorage.setItem('tokenExp', response.data.tokenExp)
        } else {
          return "Error: No token.";
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

//axios.defaults.headers.common['Authorization'] = api.getToken();

const handler: Handler = async () => {
  console.log(await getToken());

  return {
    statusCode: 300,
  };
};

export { handler };