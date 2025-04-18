import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { UserEntity } from '@/database/entity/user.entity';
import { CommonDto } from '@/common/dto/common.dto';

export class BoardDto extends CommonDto {
  @ApiProperty({ example: 1, description: '게시글 ID' })
  @Expose()
  id: number;

  @ApiProperty({ example: '게시글 제목', description: '게시글 제목' })
  @Expose()
  title: string;

  @ApiProperty({ example: '게시글 내용입니다.', description: '게시글 내용' })
  @Expose()
  content: string;

  @ApiProperty({ type: () => UserEntity, description: '작성자' })
  @Expose()
  @Type(() => UserEntity)
  createdBy: UserEntity;

  @ApiProperty({ type: () => UserEntity, description: '수정자' })
  @Expose()
  @Type(() => UserEntity)
  updatedBy: UserEntity;
}
