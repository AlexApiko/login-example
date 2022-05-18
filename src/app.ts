import express from 'express';
import bodyParser from 'body-parser';
import { apiRouter } from './routes';
import { handleError } from './middlewares/handle-error';

export const app = express();

app.use('/api', bodyParser.json(), apiRouter);

app.use(handleError);

export const startServer = () =>
  new Promise((res) => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running at: http://localhost:${PORT}`);
      res(null);
    });
  });
