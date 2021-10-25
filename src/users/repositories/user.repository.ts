import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthCredentialsDto } from '../dto/auth-credentials.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UpdatePasswordDto } from '../dto/update-password.dto';
import { User } from '../entities/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async register(createUserDto: CreateUserDto): Promise<void> {
    const { first_name, last_name, username, email, password } = createUserDto;

    const salt = await bcrypt.genSalt();

    const user = new User();
    user.first_name = first_name;
    user.last_name = last_name;
    user.username = username;
    user.email = email;
    user.password = await this.hashPassword(password, salt);
    user.salt = salt;

    const email_check = await this.findOne({ where: { email: user.email } });
    const username_check = await this.findOne({
      where: { username: user.username },
    });

    if (email_check) {
      throw new ConflictException(
        `A user already exists with ${user.email} as an email address. Please try another, or login using your existing account.`,
      );
    } else if (username_check) {
      throw new ConflictException(
        `A user already exists with ${user.username} as their username. Please try another, or login using your existing account.`,
      );
    } else {
      await this.save(user);
    }
  }

  async validateUserPassword(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<string> {
    const { username, password } = authCredentialsDto;
    const user = await this.findOne({ where: { username: username } });

    if (user && (await user.validatePassword(password))) {
      return user.username;
    } else {
      return null;
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return await bcrypt.hash(password, salt);
  }

  async getAllUsers(): Promise<User[]> {
    const query = this.createQueryBuilder('users');
    const users = await query.getMany();
    return users;
  }

  async getSingleUser(id: number, user: User): Promise<User> {
    if (id !== user.id) {
      throw new UnauthorizedException(
        'You are unauthorized to view this user.',
      );
    }
    return this.findOne(id);
  }

  async updateUser(id: number, user: User, updateDto: UpdateUserDto) {
    if (id !== user.id) {
      throw new UnauthorizedException(
        'You are not authorized to update this record.',
      );
    }

    const { username, email } = updateDto;

    let user_object = await this.getSingleUser(id, user);
    user_object = await this.preload({ id: +id, ...updateDto });

    const email_check = await this.findOne({
      where: { email: email },
    });
    const username_check = await this.findOne({
      where: { username: username },
    });

    if (email_check) {
      throw new ConflictException(
        `A user already exists with ${email_check.email} as an email address. Please try another, or login using your existing account.`,
      );
    } else if (username_check) {
      throw new ConflictException(
        `A user already exists with ${username_check.username} as their username. Please try another, or login using your existing account.`,
      );
    }

    delete user_object.password;
    delete user_object.salt;
    return await this.save(user_object);
  }

  async updatePassword(
    id: number,
    user: User,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<string> {
    if (id !== user.id) {
      throw new UnauthorizedException(
        'You are not authorized to update this record.',
      );
    }
    const current_hashed_pw = user.password;
    const current_salt = user.salt;
    const { password } = updatePasswordDto;
    const hash_check = await this.hashPassword(password, current_salt);
    const new_salt = await bcrypt.genSalt();
    const new_hashed_password = await this.hashPassword(password, new_salt);
    const user_object = await this.getSingleUser(id, user);
    user_object.password = new_hashed_password;
    user_object.salt = new_salt;

    if (current_hashed_pw === hash_check) {
      throw new ConflictException(
        'This password was already in use before. Choose another.',
      );
    } else {
      await this.save(user_object);
      return 'Password updated.';
    }
  }

  async deleteUser(id: number, user: User): Promise<User> {
    const to_remove = await this.getSingleUser(id, user);

    if (id !== user.id) {
      throw new UnauthorizedException(
        'You are not authorized to update this record.',
      );
    }

    if (!to_remove) {
      throw new NotFoundException('User not found.');
    } else {
      await this.remove(to_remove);
      return to_remove;
    }
  }
}
