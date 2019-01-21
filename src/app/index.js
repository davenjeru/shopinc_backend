import express from 'express';
import env from '../config';

const app = express();

app.get('/', (req, res) => {
  res.send(`Hey It's working! Process ID = ${process.pid}`);
});

const { port } = env;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
