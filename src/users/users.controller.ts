import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './users.service';

@Controller('users')
export class UserController {
  constructor(private readonly authService: UserService) {}

  @Post('/register')
  register(@Body(ValidationPipe) createUserDto: CreateUserDto): Promise<void> {
    return this.authService.register(createUserDto);
  }

  @Post('/login')
  login(
    @Body() authcredentials: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.login(authcredentials);
  }

  @Get()
  getAllUsers(): Promise<User[]> {
    return this.authService.getAllUsers();
  }

  @Get(':id')
  @UseGuards(AuthGuard())
  getSingleUser(@Param('id') id: number, @GetUser() user: User) {
    return this.authService.getSingleUser(id, user);
  }

  @Patch(':id')
  @UseGuards(AuthGuard())
  updateUser(
    @Param('id') id: number,
    @GetUser() user: User,
    @Body() updateDto: UpdateUserDto,
  ) {
    return this.authService.updateUser(id, user, updateDto);
  }

  @Patch(':id/password-update')
  @UseGuards(AuthGuard())
  updatePassword(
    @Param('id') id: number,
    @GetUser() user: User,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.authService.updatePassword(id, user, updatePasswordDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  deleteUser(@Param('id') id: number, @GetUser() user: User): Promise<User> {
    return this.authService.deleteUser(id, user);
  }
}
