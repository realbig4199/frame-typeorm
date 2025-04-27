// UserEntity -> GetUserDtoRx로 변환하는 함수
import { UserEntity } from '@/database/entity/user.entity';
import { GetUserDtoRx } from '@/api/user/dto/getUser.dto';

export function toUserDto(user: UserEntity): GetUserDtoRx {
  return {
    id: user.id,
    gender: user.gender,
    phone: user.phone,
    email: user.email,
  };
}
