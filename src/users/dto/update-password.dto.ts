import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  // @Matches takes reg expression and validates that our password contains an uppercase, special char, and number
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Get a password check - yours is weaker than weak.',
  })
  password: string;
}
