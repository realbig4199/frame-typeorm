import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from '@/user/user.service';
import { CommonRx } from '@/common/common.dto';
import { SignUpDtoTx } from '@/user/dto/user.dto';
import { JwtToken } from '@/jwt/jwt.dto';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
