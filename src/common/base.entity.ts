import {
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
} from 'typeorm';
import { State } from '@/common/state.type';

export abstract class BaseEntity {
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

  @DeleteDateColumn({ nullable: true })
  public deletedAt?: Date;
}
