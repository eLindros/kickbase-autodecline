import { config as configDotenv } from 'dotenv';
import { resolve } from 'path';

// Example from: https://stackoverflow.com/questions/45194598/using-process-env-in-typescript
// switch(process.env.NODE_ENV) {
//   case "development":
//     console.log("Environment is 'development'")
//     configDotenv({
//       path: resolve(__dirname, "../.env.development")
//     })
//     break
//   case "test":
//     configDotenv({
//       path: resolve(__dirname, "../.env.test")
//     })
//     break
//   // Add 'staging' and 'production' cases here as well!
//   default:
//     throw new Error(`'NODE_ENV' ${process.env.NODE_ENV} is not handled!`)
// }

configDotenv({
  path: resolve(__dirname, '../.env'),
});
