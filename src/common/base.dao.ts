import {
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

export abstract class BaseDao extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public uuid: string;

  @Column()
  public state: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
