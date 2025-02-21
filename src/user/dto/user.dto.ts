import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, IsUUID, ValidateNested } from 'class-validator';

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

export class GetUserDtoRx {
  @ApiProperty({ example: '유저 UUID' })
  @IsUUID()
  public userUuid: string;

  @ApiProperty({ example: '이름' })
  @IsString()
  public name: string;

  @ApiProperty({ example: '아이디' })
  @IsString()
  public passid: string;
}

export class GetUsersDtoRx {
  @ApiProperty({
    type: [GetUserDtoRx],
  })
  @IsArray()
  @ValidateNested({ each: true })
  public users: GetUserDtoRx[];
}
