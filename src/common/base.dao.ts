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

  @Column({ unique: true })
  public uuid: string;

  @Column()
  public state: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  // ✅ 자동 값 할당
  @BeforeInsert()
  generateFields() {
    if (!this.uuid) {
      this.uuid = uuidv4();
    }
    if (!this.state) {
      this.state = State.Activation;
    }
  }
}
