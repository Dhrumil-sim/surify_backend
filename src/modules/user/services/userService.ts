import { StatusCodes } from 'http-status-codes';
import { User } from '@models';
import { ApiError } from '@utils';
import {
  USER_CODES,
  USER_MESSAGES,
} from '../constants/user.error.massages.constant.js';

class UserService {
  static async createUser(
    username: string,
    email: string,
    password: string,
    role: string,
    profilePicture: string
  ) {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      throw new ApiError(
        StatusCodes.CONFLICT,
        USER_CODES.USER_ALREADY_EXISTS,
        USER_MESSAGES.USER_ALREADY_EXISTS
      );
    }

    const newUser = await User.create({
      username,
      email,
      password,
      role,
      profile_picture: profilePicture,
    });
    return newUser;
  }

  static async validateUserCredentials(
    emailOrUsername: string,
    password: string
  ) {
    const user = await User.findOne({
      $or: [{ username: emailOrUsername }, { email: emailOrUsername }],
    }).select('+password');

    if (!user) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        USER_CODES.USER_NOT_FOUND,
        USER_MESSAGES.USER_NOT_FOUND
      );
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        USER_CODES.INVALID_CREDENTIALS,
        USER_MESSAGES.INVALID_CREDENTIALS
      );
    }
    return user;
  }
}

export default UserService;
