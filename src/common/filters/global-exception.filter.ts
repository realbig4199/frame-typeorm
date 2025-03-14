import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { ERROR_CODES } from '@/common/constants/error-codes';
import { CustomException } from '@/common/exceptions/custom-exception';
import { ResponseDto } from '@/common/dto/response.dto';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = ERROR_CODES.INTERNAL_SERVER_ERROR.code;
    let message = ERROR_CODES.INTERNAL_SERVER_ERROR.message;

    // CustomException이면 그대로 반환
    if (exception instanceof CustomException) {
      status = exception.getStatus();
      const errorResponse = exception.getResponse() as any;
      return response.status(status).json(errorResponse);
    }

    // HttpException이면 ResponseDto.error()로 변환
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseBody = exception.getResponse();

      if (typeof responseBody === 'string') {
        message = responseBody;
      } else if (typeof responseBody === 'object' && responseBody['message']) {
        message = responseBody['message'];
      }

      code = responseBody['code'] || code;
    }

    this.logger.error(
      `Unexpected Error: ${exception.message}`,
      exception.stack,
    );

    return response
      .status(status)
      .send(ResponseDto.error(status, { code, message }));
  }
}
