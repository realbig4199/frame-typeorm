import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SignupDtoTx {
  @ApiProperty({ example: '아이디' })
  @IsString()
  public passid: string;

  @ApiProperty({ example: '비밀번호' })
  @IsString()
  public password: string;

  // @ApiProperty({ example: '이름' })
  // @IsString()
  // public name: string;

  @ApiProperty({ example: '성별' })
  @IsString()
  public gender: string;

  @ApiProperty({ example: '전화번호' })
  @IsString()
  public phone: string;

  @ApiProperty({ example: '이메일' })
  @IsString()
  public email: string;
}
