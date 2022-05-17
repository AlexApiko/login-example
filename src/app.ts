import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import { apiRouter } from './routes';

const app = express();

export const starServer = () => {
  const PORT = process.env.PORT || 3000;

  app.use('/api', bodyParser.json(), apiRouter);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(500).json({
      message: error.message || 'Something went wrong',
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running at: http://localhost:${PORT}`);
  });
};
