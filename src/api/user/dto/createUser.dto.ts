import { LoginEntity } from '@/database/entity/login.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDtoTx {
  @ApiProperty({ example: '이름' })
  public name: string;

  @ApiProperty({ example: '로그인 엔터티' })
  public login: LoginEntity;
}
