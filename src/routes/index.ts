import { Router } from 'express';
import { authController } from '../controllers/auth';

export const apiRouter = Router();

apiRouter.post('/login', authController.login);
