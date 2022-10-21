import './config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cron from 'node-cron';
import { autodecline } from './kickbase-autodecline';

const app = express();

app.use(cors());
app.use(morgan('combined'));

app.get('/', async (_req: Request, res: Response) => {
  var result = await autodecline();
  res.json(result);
});

var port = process.env.PORT || '3000';


cron.schedule("*/15 * * * * *", function () {
  console.log("---------------------");
  console.log("running a task every 15 seconds");
});

app.set('port', port);
app.listen(port);
