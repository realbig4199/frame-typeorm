import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CommonEntity } from '@/database/entity/common.entity';
import { UserEntity } from './user.entity';
import { State } from '@/common/enums/state.type';

@Entity({ name: 'logins' })
export class LoginEntity extends CommonEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ unique: true, default: () => 'UUID()' })
  public uuid: string;

  @Column({ default: State.Activation })
  public state: string;

  @Column({ unique: true })
  passid: string;

  @Column()
  password: string;

  @OneToOne(() => UserEntity, (user) => user.login)
  user: UserEntity;
}
