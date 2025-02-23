import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsArray, IsString, IsUUID, ValidateNested } from 'class-validator';

export class SignupDtoTx {
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

export class UpdateUserDtoTx extends PartialType(
  OmitType(SignupDtoTx, ['password']),
) {}

export class GetUsersDtoRx {
  @ApiProperty({
    type: [GetUserDtoRx],
  })
  @IsArray()
  @ValidateNested({ each: true })
  public users: GetUserDtoRx[];
}

export class SigninDtoTx {
  @ApiProperty({ example: 'admin' })
  @IsString()
  public passid: string;

  @ApiProperty({ example: 'recipot1!11' })
  @IsString()
  public password: string;
}
