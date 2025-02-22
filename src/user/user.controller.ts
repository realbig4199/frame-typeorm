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
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from '@/user/user.service';
import {
  GetUserDtoRx,
  GetUsersDtoRx,
  SignUpDtoTx,
  UpdateUserDtoTx,
} from '@/user/dto/user.dto';
import { JwtToken } from '@/jwt/jwt.dto';
import { JwtGuard } from '@/jwt/jwt.guard';
import { PaginationDtoTx } from '@/common/pagination.dto';
import { CommonRx } from '@/common/common.dto';

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
   * @description 유저를 상세조회한다.
   */
  // @UseGuards(JwtGuard)
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
  // @UseGuards(JwtGuard)
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
  // @UseGuards(JwtGuard)
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
