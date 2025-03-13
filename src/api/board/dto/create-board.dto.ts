import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBoardDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '제목' })
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '내용' })
  content: string;
}
