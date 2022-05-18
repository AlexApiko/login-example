import express from 'express';
import bodyParser from 'body-parser';
import { apiRouter } from './routes';
import { handleError } from './middlewares/handle-error';

const app = express();

export const starServer = () => {
  const PORT = process.env.PORT || 3000;

  app.use('/api', bodyParser.json(), apiRouter);

  app.use(handleError);

  app.listen(PORT, () => {
    console.log(`Server is running at: http://localhost:${PORT}`);
  });
};
