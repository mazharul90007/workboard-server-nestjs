import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginAuthDto {
  @IsEmail({}, { message: 'Please Provide valid email' })
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
