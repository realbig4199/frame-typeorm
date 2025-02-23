import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SigninDtoTx {
  @ApiProperty({ example: 'admin' })
  @IsString()
  public passid: string;

  @ApiProperty({ example: 'recipot1!11' })
  @IsString()
  public password: string;
}
