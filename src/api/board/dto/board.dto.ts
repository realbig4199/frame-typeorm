import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { UserEntity } from '@/database/entity/user.entity';

export class BoardDto {
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
  updateBy: UserEntity;

  @ApiProperty({ example: '2024-03-10T12:00:00Z', description: '생성 일자' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ example: '2024-03-11T12:00:00Z', description: '수정 일자' })
  @Expose()
  updatedAt: Date;

  @ApiProperty({ example: null, description: '삭제 일자' })
  @Expose()
  deletedAt?: Date;
}
