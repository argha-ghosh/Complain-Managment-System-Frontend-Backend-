import {
  Entity, PrimaryGeneratedColumn, Column,
  OneToMany, CreateDateColumn,
} from 'typeorm';

@Entity('field_engineer')
export class FieldEngineerEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name?: string;

  @Column({ unique: true })
  email?: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  specialization?: string;

  @CreateDateColumn()
  createdAt?: Date;

  @OneToMany('EngineerAssignmentEntity', 'engineer', { cascade: true })
  assignments?: any[];
}