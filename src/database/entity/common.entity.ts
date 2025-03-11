import {
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BaseEntity,
} from 'typeorm';

export abstract class CommonEntity extends BaseEntity {
  // @PrimaryGeneratedColumn()
  // public id: number;
  //
  // @Column({ unique: true, default: () => 'UUID()' })
  // public uuid: string;
  //
  // @Column({ default: State.Activation })
  // public state: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  public deletedAt?: Date;
}
