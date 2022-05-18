import { Repository } from 'typeorm';
import { User } from '../models/user';
import { dataSource } from '../data-source';

export class UserService {
  constructor(private readonly userRepository: Repository<User>) {}

  findUserByEmail = async (email: string): Promise<User | null> => {
    return this.userRepository
      .createQueryBuilder('user')
      .where({ email })
      .addSelect('user.pwdHash')
      .getOne();
  };
}

const userRepository = dataSource.getRepository<User>(User);
export const userService = new UserService(userRepository);
