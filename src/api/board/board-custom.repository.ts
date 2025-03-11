import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardEntity } from '@/database/entity/board.entity';
import { SearchCriteriaDto } from '@/common/dto/search.criteria.dto';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class BoardCustomRepository {
  constructor(
    @InjectRepository(BoardEntity)
    public readonly boardRepository: Repository<BoardEntity>,
  ) {}

  /**
   * 페이징을 포함한 게시글 목록을 조회합니다.
   * @author <lilyshin.dev@gmail.com>
   * @param searchCriteria
   * @param paginationOptions
   */
  public async findWithPagination(
    searchCriteria: SearchCriteriaDto,
    paginationOptions: IPaginationOptions,
  ): Promise<Pagination<BoardEntity>> {
    const { startDate, endDate } = searchCriteria;
    const { page, limit } = paginationOptions;

    const queryBuilder = this.boardRepository
      .createQueryBuilder('board')
      .leftJoinAndSelect('board.createdBy', 'user')
      .where('board.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .orderBy('board.createdAt', 'DESC');

    return paginate<BoardEntity>(queryBuilder, { page, limit });
  }
}
