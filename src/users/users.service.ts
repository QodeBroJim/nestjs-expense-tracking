import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<void> {
    return await this.userRepository.register(createUserDto);
  }

  async login(
    authcredentials: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const username = await this.userRepository.validateUserPassword(
      authcredentials,
    );

    if (!username) {
      throw new UnauthorizedException('Invalid login credentials supplied.');
    }

    const payload = { username };
    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken };
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.getAllUsers();
  }

  async getSingleUser(id: number, user: User) {
    return this.userRepository.getSingleUser(id, user);
  }

  async updateUser(id: number, user: User, updateDto: UpdateUserDto) {
    return this.userRepository.updateUser(id, user, updateDto);
  }

  async updatePassword(
    id: number,
    user: User,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<string> {
    return this.userRepository.updatePassword(id, user, updatePasswordDto);
  }

  async deleteUser(id: number, user: User): Promise<User> {
    return this.userRepository.deleteUser(id, user);
  }
}
