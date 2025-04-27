import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Put,
  Delete,
  UseGuards,
  Request,
  Query,
  Param,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { JwtGuard } from '@/api/jwt/jwt.guard';
import { BoardService } from './board.service';
import { CreateBoardDtoTx } from './dto/create-board.dto';
import { UpdateBoardDtoTx } from './dto/update-board.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ResponseDto } from '@/common/dto/response.dto';
import { GetBoardsDtoRx } from '@/api/board/dto/get-boards.dto';
import { AccessTokenPayload } from '@/api/jwt/jwt.type';
import { PaginationOptionsDto } from '@/common/dto/pagination-option.dto';

@Controller({ path: 'board', version: '1' })
@ApiTags('Board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @UseGuards(JwtGuard)
  @ApiBearerAuth('Authorization')
  @Post('/')
  @ApiOperation({ summary: '게시글을 생성한다.' })
  @ApiOkResponse({
    schema: {
      $ref: getSchemaPath(ResponseDto),
      properties: { result: { $ref: getSchemaPath(CreateBoardDtoTx) } },
    },
  })
  async createBoard(
    @Request() request: AccessTokenPayload,
    @Body() dto: CreateBoardDtoTx,
  ) {
    return await this.boardService.createBoard(request, dto);
  }

  @Get('/')
  @ApiOperation({ summary: '게시글 목록을 조회한다.' })
  @ApiOkResponse({
    schema: {
      $ref: getSchemaPath(ResponseDto),
      properties: {
        result: { $ref: getSchemaPath(Pagination<GetBoardsDtoRx>) },
      },
    },
  })
  async getBoards(
    @Query() paginationOptionDto: PaginationOptionsDto,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return await this.boardService.getBoards(
      paginationOptionDto,
      startDate,
      endDate,
    );
  }

  @Get('/:id')
  @ApiOperation({ summary: '게시글을 상세 조회한다.' })
  @ApiOkResponse({
    schema: {
      $ref: getSchemaPath(ResponseDto),
      properties: {
        result: { $ref: getSchemaPath(GetBoardsDtoRx) },
      },
    },
  })
  async getBoard(@Param('id') id: number) {
    return await this.boardService.getBoardById(id);
  }

  @UseGuards(JwtGuard)
  @ApiBearerAuth('Authorization')
  @Put('/:id')
  @ApiOperation({ summary: '게시글을 수정한다.' })
  @ApiOkResponse({
    schema: {
      $ref: getSchemaPath(ResponseDto),
      properties: {
        result: { example: null },
      },
    },
  })
  async updateBoard(
    @Request() user: AccessTokenPayload,
    @Param('id') id: number,
    @Body() dto: UpdateBoardDtoTx,
  ) {
    return await this.boardService.updateBoard(user, id, dto);
  }

  @UseGuards(JwtGuard)
  @ApiBearerAuth('Authorization')
  @Delete('/:id')
  @ApiOperation({ summary: '게시글을 삭제한다.' })
  @ApiOkResponse({
    schema: {
      $ref: getSchemaPath(ResponseDto),
      properties: {
        result: { example: null },
      },
    },
  })
  async deleteBoard(@Param('id') id: number) {
    return await this.boardService.deleteBoard(id);
  }
}
