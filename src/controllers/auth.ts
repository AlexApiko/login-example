import { NextFunction, Request, Response } from 'express';
import { validate } from 'class-validator';
import { authService, AuthService } from '../services/auth';
import { HttpError, UserInputError } from '../utils/http-error';
import { LoginStatus } from '../dto/login-status.enum';
import { LoginInput } from '../dto/login-input.dto';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  login = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    let status: LoginStatus;
    const { email, password } = req.body;

    // Validate email & password inputs
    if (!email) {
      status = LoginStatus.missingEmail;
      res.status(422).json({ status });
      return;
    }

    if (!password) {
      status = LoginStatus.missingPassword;
      res.status(422).json({ status });
      return;
    }

    try {
      // Handle login
      const { accessToken } = await this.authService.login({
        email,
        password,
      });

      status = LoginStatus.loggedIn;
      res.setHeader('auth-token', accessToken);
      res.json({ status });
    } catch (error) {
      // Handle invalid email or password error
      status = LoginStatus.accessDenied;
      if (error instanceof HttpError) {
        res.status(403).json({ status });
        return;
      }

      next(error);
    }
  };

  loginV2 = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { email, password } = req.body;

    try {
      // Validate login input
      await this.validateLoginInput({ email, password });

      // Handle login
      const { accessToken, refreshToken, user } = await this.authService.login({
        email,
        password,
      });

      res.json({ accessToken, refreshToken, user });
    } catch (error) {
      next(error);
    }
  };

  validateLoginInput = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<void> => {
    const loginInput = new LoginInput();
    loginInput.email = email;
    loginInput.password = password;

    const validationErrors = await validate(loginInput);

    if (validationErrors?.length) {
      throw new UserInputError('Invalid input', validationErrors);
    }
  };
}

export const authController = new AuthController(authService);
