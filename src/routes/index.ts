import { Router } from 'express';
import { authController } from '../controllers/auth';

export const apiRouter = Router();

apiRouter.post('/login', authController.login);
apiRouter.post('/login-v2', authController.loginV2);
