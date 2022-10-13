import { Handler } from '@netlify/functions';
import { KickbaseApi } from '../api/KickbaseApi';

// Login to Kickbase => Token

// Get all players with market values and offers

// calculate too low offers

// every hour: put all player without offer on market

// every hour: remove player with too low offer from market

const handler: Handler = async () => {
  const user: string = process.env.KICKBASE_USER || 'none';
  const password: string = process.env.KICKBASE_PASSWORD || 'none';

  const kickbase = new KickbaseApi(user, password);
  await kickbase.getMarket();
  if (kickbase.data.market) console.log(kickbase.data.market);

  return {
    statusCode: 200,
  };
};

export { handler };
