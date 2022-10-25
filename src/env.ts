import { config as configDotenv } from 'dotenv';
import { resolve } from 'path';

// load .env when on local machine
configDotenv({
  path: resolve(__dirname, '../.env'),
});
