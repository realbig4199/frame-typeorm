import {
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BaseEntity,
} from 'typeorm';

export abstract class CommonEntity extends BaseEntity {
  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  public deletedAt?: Date;
}
