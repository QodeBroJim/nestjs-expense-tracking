import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class AuthCredentialsDto {
  @IsString()
  @MinLength(5)
  @MaxLength(25)
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  // @Matches takes reg expression and validates that our password contains an uppercase, special char, and number
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password is literal weak sauce. Try that again.',
  })
  password: string;
}
