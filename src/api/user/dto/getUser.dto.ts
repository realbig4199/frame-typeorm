import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class GetUserDtoRx {
  @ApiProperty({ example: '아이디' })
  @IsNumber()
  public id: number;

  // 엔터티 구조 변경에 따른 수정
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

  @ApiProperty({ example: '아이디' })
  @IsString()
  public passid: string;
}
