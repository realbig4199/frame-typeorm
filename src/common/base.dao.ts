import {
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { State } from '@/common/state.type';

export abstract class BaseDao extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ unique: true, default: () => 'UUID()' })
  public uuid: string;

  @Column({ default: State.Activation })
  public state: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
