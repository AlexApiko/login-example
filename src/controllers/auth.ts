import { NextFunction, Request, Response } from 'express';
import { authService, AuthService } from '../services/auth';

type LoginStatus =
  | 'logged in'
  | 'access denied'
  | 'missing password'
  | 'missing email';

class AuthController {
  constructor(private readonly authService: AuthService) {}

  login = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    let status: LoginStatus;
    try {
      const { email, password } = req.body;

      const { accessToken } = await this.authService.login({
        email,
        password,
      });

      status = 'logged in';
      res.setHeader('auth-token', accessToken);
      res.json({ status });
    } catch (error) {
      next(error);
    }
  };
}

export const authController = new AuthController(authService);
