import { ApiProperty } from '@nestjs/swagger';
import { GetUserDtoRx } from '@/user/dto/getUser.dto';
import { IsArray, ValidateNested } from 'class-validator';

export class GetUsersDtoRx {
  @ApiProperty({
    type: [GetUserDtoRx],
  })
  @IsArray()
  @ValidateNested({ each: true })
  public users: GetUserDtoRx[];
}
