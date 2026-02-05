import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginAuthDto {
  @ApiProperty({
    example: 'admin@gmail.com',
    description: 'The email of the user',
  })
  @IsEmail({}, { message: 'Please Provide valid email' })
  email: string;

  @ApiProperty({ example: '123456', description: 'The password of the user' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
