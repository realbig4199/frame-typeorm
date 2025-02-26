import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  UseGuards,
  Request,
  Query,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtToken } from '@/api/jwt/jwt.dto';

import { PaginationDtoTx } from '@/common/pagination.dto';
import { CommonRx } from '@/common/common.dto';
import { JwtGuard } from '@/api/jwt/jwt.guard';
import { GetUsersDtoRx } from './dto/getUsers.dto';
import { GetUserDtoRx } from './dto/getUser.dto';
import { UpdateUserDtoTx } from './dto/updateUser.dto';
import { SignupDtoTx } from './dto/signup.dto';
import { SigninDtoTx } from './dto/signin.dto';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * @author 김진태 <reabig4199@gmail.com>
   * @description 유저를 조회한다.
   */
  @UseGuards(JwtGuard)
  @ApiBearerAuth('Authorization')
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
   * @description 유저를 상세조회한다.
   */
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @Get('/:uuid')
  @ApiOperation({ summary: '유저를 상세조회한다.' })
  @ApiResponse({ status: HttpStatus.OK, type: GetUserDtoRx })
  async getUser(@Request() request: any, @Param('uuid') uuid: string) {
    try {
      return await this.userService.getUser(request.user, uuid);
    } catch (err) {
      throw err;
    }
  }

  /**
   * @author 김진태 <realbig4199@gmail.com>
   * @description 유저를 수정한다.
   */
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @Put('/:uuid')
  @ApiOperation({ summary: '유저를 수정한다.' })
  @ApiResponse({ status: HttpStatus.OK, type: CommonRx })
  async updateUser(
    @Request() request: any,
    @Param('uuid') uuid: string,
    @Body() dto: UpdateUserDtoTx,
  ) {
    try {
      return await this.userService.updateUser(request.user, uuid, dto);
    } catch (err) {
      throw err;
    }
  }

  /**
   * @author 김진태 <realbig4199@gmail.com>
   * @description 유저를 삭제한다.
   */
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @Delete('/:uuid')
  @ApiOperation({ summary: '유저를 삭제한다.' })
  @ApiResponse({ status: HttpStatus.OK, type: CommonRx })
  async deleteUser(@Request() request: any, @Param('uuid') uuid: string) {
    try {
      return await this.userService.deleteUser(request.user, uuid);
    } catch (err) {
      throw err;
    }
  }

  /**
   * @author 김진태 <realbig4199@gmail.com>
   * @description 유저를 생성한다. (회원가입)
   */
  @Post('/signup')
  @ApiOperation({ summary: '유저를 생성한다. (회원가입)' })
  @ApiResponse({ status: HttpStatus.CREATED, type: JwtToken })
  async signup(@Body() dto: SignupDtoTx): Promise<JwtToken> {
    try {
      return await this.userService.signup(dto);
    } catch (err) {
      throw err;
    }
  }

  /**
   * @author 김진태 <realbig4199@gmail.com>
   * @description 로그인한다.
   */
  @Post('/signin')
  @ApiOperation({ summary: '로그인한다.' })
  @ApiResponse({ status: HttpStatus.OK, type: JwtToken })
  async signin(@Body() dto: SigninDtoTx) {
    try {
      return await this.userService.signin(dto);
    } catch (err) {
      throw err;
    }
  }
}
