import './config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { autodecline } from './kickbase-autodecline';

const app = express();

app.use(cors());
app.use(morgan('combined'));

app.get('/', async (_req: Request, res: Response) => {
  var result = await autodecline();
  res.json(result);
});

var port = process.env.PORT || '3000';
app.set('port', port);
app.listen(port);
