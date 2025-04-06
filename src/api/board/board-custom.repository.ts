import { Injectable } from '@nestjs/common';
import { Between, Repository } from 'typeorm';
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
   * @param searchCriteria
   * @param paginationOptions
   */
  public async findWithPagination(
    searchCriteria: SearchCriteriaDto,
    paginationOptions: IPaginationOptions,
  ): Promise<Pagination<BoardEntity>> {
    const { startDate, endDate } = searchCriteria;
    const { page, limit } = paginationOptions;

    return await paginate<BoardEntity>(
      this.boardRepository,
      { page, limit },
      {
        where: {
          createdAt: Between(new Date(startDate), new Date(endDate)),
        },
        order: {
          createdAt: 'DESC',
        },
        relations: ['createdBy'],
      },
    );
  }
}
