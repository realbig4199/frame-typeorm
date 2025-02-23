import { Column, Entity, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@/common/base.entity';
import { LoginEntity } from './login.entity';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @Column()
  name: string;

  // 추후 핸드폰 번호, 등등 추가

  @OneToOne(() => LoginEntity, (login) => login.user)
  @JoinColumn({ name: 'login_id' })
  login: LoginEntity;
}
