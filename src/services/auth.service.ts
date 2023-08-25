import UserService from './user.service.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../env.js';
import { User } from '../interfaces/user.interface.js';

export default class AuthService {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public async logIn({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<
    | {
        userData: User;
        token: string;
      }
    | string
  > {
    // Find user with given email
    const user = await this.userService.getUserByEmail({ email });

    if (!!!user) return 'User with given email does not exists!';

    // Validate password
    if (!bcrypt.compareSync(password, user.password)) {
      return 'Incorrect Password!';
    }

    // Return jwt token
    const token = jwt.sign({ id: user._id }, JWT_SECRET as unknown as string, {
      algorithm: 'HS256',
      allowInsecureKeySizes: true,
      expiresIn: 86400, // 24 hours
    });

    return {
      userData: user,
      token,
    };
  }

  public async signUp({
    username,
    email,
    password,
  }: {
    username: string;
    email: string;
    password: string;
  }): Promise<void | string> {
    try {
      // Look for user with given email, throw error if found one
      const user = await this.userService.getUserByEmail({ email });

      if (!!user) {
        return 'User with given email already exists!';
      }

      // create new user with userService
      await this.userService.postUser({
        userData: {
          username,
          email,
          password: bcrypt.hashSync(password, 8),
        },
      });
    } catch (error) {
      console.error(error);
    }
  }
}
