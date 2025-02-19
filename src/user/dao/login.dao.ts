import { Column, Entity, OneToOne, JoinColumn, BeforeInsert } from 'typeorm';
import { BaseDao } from '@/common/base.dao';
import { UserDao } from '@/user/dao/user.dao';

@Entity({ name: 'logins' })
export class LoginDao extends BaseDao {
  @Column({ unique: true })
  passid: string;

  @Column()
  password: string;

  @OneToOne(() => UserDao, (user) => user.login)
  user: UserDao;
}
