import { Router } from 'express';

export const apiRouter = Router();

apiRouter.post('/login', (req, res) => {
  res.json({ status: 'logged in' });
});
