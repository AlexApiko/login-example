import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import { apiRouter } from './routes';
import { HttpError } from './utils/http-error';

const app = express();

export const starServer = () => {
  const PORT = process.env.PORT || 3000;

  app.use('/api', bodyParser.json(), apiRouter);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof HttpError) {
      res.status(error.statusCode).json({
        message: error.message,
      });
    } else {
      res.status(500).json({
        message: 'Internal server error',
      });
    }
  });

  app.listen(PORT, () => {
    console.log(`Server is running at: http://localhost:${PORT}`);
  });
};
