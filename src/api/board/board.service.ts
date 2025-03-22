import { Inject, Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { BoardCustomRepository } from '@/api/board/board-custom.repository';
import { SearchCriteriaDto } from '@/common/dto/search.criteria.dto';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { UserCustomRepository } from '@/api/user/user-custom.repository';
import { CustomException } from '@/common/exceptions/custom-exception';
import { ERROR_CODES } from '@/common/constants/error-codes';
import { BoardDto } from '@/api/board/dto/board.dto';
import { AccessTokenPayload } from '@/api/jwt/jwt.type';
import { plainToInstance } from 'class-transformer';
import { DatabaseService } from '@/database/database.service';
import { EntityManager } from 'typeorm';
import { BoardEntity } from '@/database/entity/board.entity';

@Injectable()
export class BoardService {
  constructor(
    @Inject(BoardCustomRepository)
    private readonly boardCustomRepository: BoardCustomRepository,
    @Inject(UserCustomRepository)
    private readonly userCustomRepository: UserCustomRepository,
    private readonly databaseService: DatabaseService,
  ) {}

  /**
   * 게시글을 생성합니다.
   * @param user
   * @param dto
   */
  public async createBoard(user: AccessTokenPayload, dto: CreateBoardDto) {
    const existUser = await this.userCustomRepository.userRepository.findOne({
      where: { id: user.userId },
    });
    if (!existUser) {
      throw new CustomException(ERROR_CODES.USER_NOT_FOUND);
    }

    const newBoard = this.boardCustomRepository.boardRepository.create({
      ...dto,
      createdBy: existUser,
      updatedBy: existUser,
    });

    return await this.boardCustomRepository.boardRepository.save(newBoard);
  }

  /**
   * 게시글을 업데이트합니다.
   * @param user
   * @param id
   * @param dto
   */
  public async updateBoard(
    user: AccessTokenPayload,
    id: number,
    dto: UpdateBoardDto,
  ): Promise<void> {
    const existUser = await this.userCustomRepository.userRepository.findOne({
      where: { id: user.userId },
    });
    if (!existUser) {
      throw new CustomException(ERROR_CODES.USER_NOT_FOUND);
    }

    const board = await this.boardCustomRepository.boardRepository.findOne({
      where: { id },
    });

    if (!board) {
      throw new CustomException(ERROR_CODES.DATA_NOT_FOUND);
    }

    board.title = dto.title;
    board.content = dto.content;
    board.updatedBy = existUser;
    await this.boardCustomRepository.boardRepository.save(board);
  }

  /**
   * 페이지네이션과 함께 게시글 목록을 조회합니다.
   * @param searchCriteria
   * @param paginationOptions
   */
  public async getBoards(
    searchCriteria: SearchCriteriaDto,
    paginationOptions: IPaginationOptions,
  ): Promise<BoardDto[]> {
    const paginationResult =
      await this.boardCustomRepository.findWithPagination(
        searchCriteria,
        paginationOptions,
      );

    // class-transformer: entity to Dto
    return paginationResult.items.map((board) =>
      plainToInstance(BoardDto, board, { excludeExtraneousValues: true }),
    );
  }

  /**
   * 게시글을 상세 조회 합니다.
   * @param id
   */
  public async getBoardById(id: number) {
    return await this.boardCustomRepository.boardRepository.findOneBy({ id });
  }

  /**
   * 게시글을 삭제합니다.
   * @param id
   */
  public async deleteBoard(id: number) {
    const board = await this.getBoardById(id);
    if (!board) {
      throw new CustomException(ERROR_CODES.DATA_NOT_FOUND);
    }
    await this.databaseService.transaction(async (manager: EntityManager) => {
      await manager.delete(BoardEntity, id);
    });
  }
}
