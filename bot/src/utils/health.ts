import express from 'express';
import logger from './logger';

const app = express();
const port = 3000;

app.get('/health', (req, res) => {
  res.send({ status: 'ok' });
});

app.listen(port, () => {
  logger.info(`Health check is running on port ${port}`);
});
