import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto<T> {
  constructor(
    status: number,
    code: string | null,
    message: string | null,
    result: T | null,
  ) {
    this.status = status;
    this.code = code ?? null;
    this.message = message ?? null;
    this.result = result;
  }

  @ApiProperty({ example: 200, description: 'HTTP 상태 코드' })
  public status: number;

  @ApiProperty({
    example: null,
    description: '실패 시만 존재, 성공 시 null',
    nullable: true,
  })
  public code?: string | null;

  @ApiProperty({
    example: null,
    description: '성공 시 null, 실패 시 메시지 포함',
    nullable: true,
  })
  public message?: string | null;

  @ApiProperty({ description: '응답 데이터', nullable: true })
  public result: T | null = null;

  /** 성공 응답 (code와 message는 null) */
  static success<T>(result: T): ResponseDto<T> {
    return new ResponseDto(200, null, null, result);
  }

  /** 에러 응답 (result는 null) */
  static error(
    status: number,
    error: { code: string; message: string },
  ): ResponseDto<null> {
    return new ResponseDto(status, error.code, error.message, null);
  }
  toJSON() {
    return {
      status: this.status,
      code: this.code,
      message: this.message,
      result: this.result,
    };
  }
}
