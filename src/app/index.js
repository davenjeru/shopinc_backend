import express from 'express';
import env from '../config';
import { serverLogger } from '../loggers';

const app = express();

app.get('/', (req, res) => {
  res.send(`Hey It's working! Process ID = ${process.pid}`);
});

const { PORT, HOST } = env;

app.listen(PORT, HOST, () => {
  serverLogger(`Listening on port ${PORT}`);
});
