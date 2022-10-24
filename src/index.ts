import './config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import schedule from 'node-schedule';
import { timestamp } from './helpers';
import {
  setup,
  declineLowOffers,
  putAllPlayersOnMarket,
} from './kickbase-autodecline';

const app = express();

app.use(cors());
app.use(morgan('combined'));

app.get('/', async (_req: Request, res: Response) => {
  res.send('Nothing to show.');
});

var port = process.env.PORT || '3000';

const ruleDeclineLowOffers = new schedule.RecurrenceRule();
ruleDeclineLowOffers.minute = 0;
ruleDeclineLowOffers.hour = [new schedule.Range(0, 20), 23];
ruleDeclineLowOffers.tz = 'Europe/Berlin';

const rulePutAllOnMarket = new schedule.RecurrenceRule();
rulePutAllOnMarket.minute = 5;

schedule.scheduleJob(ruleDeclineLowOffers, async () => {
  timestamp();
  const response = await setup();
  if (response) {
    const { leagueId, userId } = response;
    declineLowOffers(leagueId, userId);
    timestamp();
  }
});

schedule.scheduleJob(rulePutAllOnMarket, async () => {
  timestamp();
  const response = await setup();
  if (response) {
    const { leagueId, userId } = response;
    putAllPlayersOnMarket(leagueId, userId);
    timestamp();
  }
});

app.set('port', port);
app.listen(port);
