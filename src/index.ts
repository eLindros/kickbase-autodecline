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

cron.schedule('0 0-20,23 * * *', function () {
  console.log('---------------------');
  console.log('running a task: 0 23-20 * * *');
  console.log(new Date());
});

app.set('port', port);
app.listen(port);
