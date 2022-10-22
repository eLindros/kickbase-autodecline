import './config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
// import cron from 'node-cron';
import schedule from 'node-schedule';
import { autodecline } from './kickbase-autodecline';

const app = express();

app.use(cors());
app.use(morgan('combined'));

app.get('/', async (_req: Request, res: Response) => {
  var result = await autodecline();
  res.json(result);
});

var port = process.env.PORT || '3000';

const rule = new schedule.RecurrenceRule();
rule.minute = 0;
rule.hour = [new schedule.Range(0, 20), 23];
rule.tz = 'Europe/Berlin';

const job = schedule.scheduleJob(rule, function () {
  // cron.schedule('0 0-20,23 * * *', function () {
  console.log('---------------------');
  console.log('running a task: 0 23-20 * * *');
  console.log(new Date());
  // },
  // {
  //    scheduled: true,
  // 	 timezone: "Europe/Berlin"
});

app.set('port', port);
app.listen(port);
