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
  Version,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { JwtGuard } from '@/api/jwt/jwt.guard';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { SearchCriteriaDto } from '@/common/dto/search.criteria.dto';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { ResponseDto } from '@/common/dto/response.dto';
import { BoardDto } from '@/api/board/dto/board.dto';
import { AccessTokenPayload } from '@/api/jwt/jwt.type';

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
      properties: { result: { $ref: getSchemaPath(CreateBoardDto) } },
    },
  })
  @Version('1')
  async createBoard(
    @Request() request: AccessTokenPayload,
    @Body() dto: CreateBoardDto,
  ) {
    return await this.boardService.createBoard(request, dto);
  }

  @Get('/')
  @ApiOperation({ summary: '게시글 목록을 조회한다.' })
  @ApiQuery({
    name: 'page',
    required: true,
    example: 1,
    description: '페이지 번호',
  })
  @ApiQuery({
    name: 'limit',
    required: true,
    example: 10,
    description: '페이지당 게시글 수',
  })
  @ApiOkResponse({
    schema: {
      $ref: getSchemaPath(ResponseDto),
      properties: { result: { $ref: getSchemaPath(Pagination<BoardDto>) } },
    },
  })
  @Version('1')
  async getBoards(
    @Query() searchCriteria: SearchCriteriaDto,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const paginationOptions: IPaginationOptions = { page, limit };
    return await this.boardService.getBoards(searchCriteria, paginationOptions);
  }

  @Get('/:id')
  @ApiOperation({ summary: '게시글을 상세 조회한다.' })
  @ApiResponse({ status: HttpStatus.OK })
  async getBoard(@Param('id') id: number) {
    return await this.boardService.getBoardById(id);
  }

  @UseGuards(JwtGuard)
  @ApiBearerAuth('Authorization')
  @Put('/:id')
  @ApiOperation({ summary: '게시글을 수정한다.' })
  @ApiResponse({ status: HttpStatus.OK })
  async updateBoard(
    @Request() user: AccessTokenPayload,
    @Param('id') id: number,
    @Body() dto: UpdateBoardDto,
  ) {
    return await this.boardService.updateBoard(user, id, dto);
  }

  @UseGuards(JwtGuard)
  @ApiBearerAuth('Authorization')
  @Delete('/:id')
  @ApiOperation({ summary: '게시글을 삭제한다.' })
  @ApiResponse({ status: HttpStatus.OK })
  async deleteBoard(@Param('id') id: number) {
    return await this.boardService.deleteBoard(id);
  }
}
