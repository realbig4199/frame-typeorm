import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from '@/user/user.service';
import { GetUserDtoRx, GetUsersDtoRx, SignUpDtoTx } from '@/user/dto/user.dto';
import { JwtToken } from '@/jwt/jwt.dto';
import { JwtGuard } from '@/jwt/jwt.guard';
import { PaginationDtoTx } from '@/common/pagination.dto';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * @author 김진태 <reabig4199@gmail.com>
   * @description 유저를 조회한다.
   */
  // @UseGuards(JwtGuard)
  @Get('/')
  @ApiOperation({ summary: '유저를 조회한다.' })
  @ApiResponse({ status: HttpStatus.OK, type: GetUsersDtoRx })
  async getUsers(@Request() request: any, @Query() query: PaginationDtoTx) {
    try {
      return await this.userService.getUsers(request.user, query);
    } catch (err) {
      throw err;
    }
  }

  /**
   * @author 김진태 <realbig4199@gmail.com>
   * @description 유저를 생성한다. (회원가입)
   */
  @Post('/signUp')
  @ApiOperation({ summary: '유저를 생성한다. (회원가입)' })
  @ApiResponse({ status: HttpStatus.CREATED, type: JwtToken })
  async signUp(@Body() dto: SignUpDtoTx): Promise<JwtToken> {
    try {
      return await this.userService.signUp(dto);
    } catch (err) {
      throw err;
    }
  }
}
