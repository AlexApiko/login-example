import { NextFunction, Request, Response } from 'express';
import { authService, AuthService } from '../services/auth';
import { HttpError } from '../utils/http-error';

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
    const { email, password } = req.body;

    if (!email) {
      status = 'missing email';
      res.status(422).json({ status });
      return;
    }

    if (!password) {
      status = 'missing password';
      res.status(422).json({ status });
      return;
    }

    try {
      const { accessToken } = await this.authService.login({
        email,
        password,
      });

      status = 'logged in';
      res.setHeader('auth-token', accessToken);
      res.json({ status });
    } catch (error) {
      // Handle invalid email or password error
      status = 'access denied';
      if (error instanceof HttpError) {
        res.status(403).json({ status });
        return;
      }

      next(error);
    }
  };
}

export const authController = new AuthController(authService);
