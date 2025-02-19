import { Column, Entity, OneToOne, JoinColumn } from 'typeorm';
import { BaseDao } from '@/common/base.dao';
import { LoginDao } from '@/user/dao/login.dao';

@Entity({ name: 'users' })
export class UserDao extends BaseDao {
  @Column()
  name: string;

  // 추후 핸드폰 번호, 등등 추가

  @OneToOne(() => LoginDao, (login) => login.user)
  @JoinColumn({ name: 'login_id' })
  login: LoginDao;
}
