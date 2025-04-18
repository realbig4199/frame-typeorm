import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CommonDto {
  @ApiProperty({ example: '2024-11-11 12:17:00', description: '생성 일자' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ example: '2024-11-11 12:17:00', description: '수정 일자' })
  @Expose()
  updatedAt: Date;

  @ApiProperty({ example: null, description: '삭제 일자' })
  @Expose()
  deletedAt?: Date;
}
