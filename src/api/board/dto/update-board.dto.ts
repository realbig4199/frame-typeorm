import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBoardDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ example: '제목' })
  title?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: '내용' })
  content?: string;
}
