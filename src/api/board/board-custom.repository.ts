import { Injectable } from '@nestjs/common';
import { Between, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardEntity } from '@/database/entity/board.entity';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { PaginationOptionsDto } from '@/common/dto/pagination-option.dto';

@Injectable()
export class BoardCustomRepository {
  constructor(
    @InjectRepository(BoardEntity)
    public readonly boardRepository: Repository<BoardEntity>,
  ) {}

  /**
   * 페이징을 포함한 게시글 목록을 조회합니다.
   * @param paginationOptions
   * @param startDate
   * @param endDate
   */
  public async findWithPagination(
    paginationOptions: PaginationOptionsDto,
    startDate: string,
    endDate: string,
  ): Promise<Pagination<BoardEntity>> {
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
