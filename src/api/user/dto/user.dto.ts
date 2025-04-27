import { ApiProperty } from '@nestjs/swagger';
import { State } from '@/common/enums/state.type';

export class UserDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  uuid: string;

  @ApiProperty({ enum: State })
  state: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  gender: string;

  @ApiProperty({ required: false })
  phone: string | null;

  @ApiProperty({ required: false })
  email: string | null;
}
