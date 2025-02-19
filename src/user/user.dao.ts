import { Column, Entity } from 'typeorm';
import { BaseDao } from '@/common/base.dao';

@Entity({ name: 'users' })
export class UserDao extends BaseDao {
  @Column()
  public name: string;
}
