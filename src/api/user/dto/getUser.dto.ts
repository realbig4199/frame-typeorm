import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class GetUserDtoRx {
  @ApiProperty({ example: '유저 UUID' })
  @IsUUID()
  public userUuid: string;

  // @ApiProperty({ example: '이름' })
  // @IsString()
  // public name: string;

  @ApiProperty({ example: '아이디' })
  @IsString()
  public passid: string;
}
