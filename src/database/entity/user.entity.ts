import { Column, Entity, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@/common/base.entity';
import { LoginEntity } from './login.entity';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @Column({ type: 'varchar', default: 'Unknown' })
  gender: string;

  @Column({ type: 'varchar', unique: true, nullable: true })
  phone: string;

  @Column({ type: 'varchar', unique: true, nullable: true })
  email: string;

  @OneToOne(() => LoginEntity, (login) => login.user)
  @JoinColumn({ name: 'login_id' })
  login: LoginEntity;
}
