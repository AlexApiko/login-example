import * as jwt from 'jsonwebtoken';
import { compare } from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { HttpError } from '../utils/http-error';
import { User, UserPublicProfile } from '../models/user';
import { userService, UserService } from './users';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserPublicProfile;
}

export class AuthService {
  constructor(private readonly userService: UserService) {}

  login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      throw new HttpError('Invalid email or password', 403);
    }

    const isValidPwd = await this.comparePasswords(password, user?.pwdHash);

    if (!isValidPwd) {
      throw new HttpError('Invalid email or password', 403);
    }

    return {
      accessToken: this.signAuthAuthToken(user),
      refreshToken: uuidv4(), // TODO: save refresh token to the DB
      user: User.getPublicProfile(user),
    };
  };

  comparePasswords = async (
    pwd: string,
    userPwdHash?: string,
  ): Promise<boolean> => {
    if (!userPwdHash) {
      return false;
    }

    return compare(pwd, userPwdHash);
  };

  signAuthAuthToken = (user: User): string => {
    return jwt.sign(
      {
        sub: user.id,
        id: user.id,
        // TODO: Add any other important fields like role etc.
      },
      process.env.JWT_SECRET as string,
    );
  };
}

export const authService = new AuthService(userService);
