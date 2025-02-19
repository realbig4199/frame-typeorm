import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SignUpDtoTx {
  @ApiProperty({ example: '아이디' })
  @IsString()
  public passid: string;

  @ApiProperty({ example: '비밀번호' })
  @IsString()
  public password: string;

  @ApiProperty({ example: '이름' })
  @IsString()
  public name: string;
}
