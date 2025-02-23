import { Column, Entity, OneToOne } from 'typeorm';
import { BaseEntity } from '@/common/base.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'logins' })
export class LoginEntity extends BaseEntity {
  @Column({ unique: true })
  passid: string;

  @Column()
  password: string;

  @OneToOne(() => UserEntity, (user) => user.login)
  user: UserEntity;
}
