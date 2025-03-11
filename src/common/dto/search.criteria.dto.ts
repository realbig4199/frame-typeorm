import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SearchCriteriaDto {
  @ApiProperty({
    example: '2025-01-01',
    description: '조회 시작 날짜 (YYYY-MM-DD 형식)',
  })
  @IsString()
  public startDate: string;

  @ApiProperty({
    example: '2025-12-31',
    description: '조회 종료 날짜 (YYYY-MM-DD 형식)',
  })
  @IsString()
  public endDate: string;
}
