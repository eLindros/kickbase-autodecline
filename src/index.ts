import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { scheduleBonusCollection } from './schedules';
import { PORT } from './settings';

// initialize express server
const app = express();

// allow cross site scripting
app.use(cors());

// user morgan logger
app.use(morgan('combined'));

// what to show when site is requested
app.get('/', async (_req: Request, res: Response) => {
  res.send('Nothing to show.');
});

// call schedule for bonus collection
scheduleBonusCollection;

// start server
app.set('port', PORT);
app.listen(PORT);
