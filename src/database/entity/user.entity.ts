import {
  Column,
  Entity,
  OneToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { CommonEntity } from '@/database/entity/common.entity';
import { LoginEntity } from './login.entity';
import { BoardEntity } from '@/database/entity/board.entity';
import { State } from '@/common/enums/state.type';

@Entity({ name: 'users' })
export class UserEntity extends CommonEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ unique: true, default: () => 'UUID()' })
  public uuid: string;

  @Column({ default: State.Activation })
  public state: string;

  @Column()
  name: string;

  // 추후 핸드폰 번호, 등등 추가

  @OneToOne(() => LoginEntity, (login) => login.user)
  @JoinColumn({ name: 'login_id' })
  login: LoginEntity;

  @OneToMany(() => BoardEntity, (board) => board.createdBy)
  boards: BoardEntity[]; // Define the reverse relationship
}
