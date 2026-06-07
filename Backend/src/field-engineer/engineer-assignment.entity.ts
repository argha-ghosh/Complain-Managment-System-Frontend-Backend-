import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';
import { FieldEngineerEntity } from './field-engineer.entity';

@Entity('engineer_assignment')
export class EngineerAssignmentEntity {
  @PrimaryGeneratedColumn()
  assignmentId?: number;

  @Column()
  engineerId?: number;

  @Column()
  complaintId?: number;

  @Column({ default: 'Assigned' })
  status?: string; // Assigned | In Progress | Resolved

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @ManyToOne(() => FieldEngineerEntity, (engineer) => engineer.assignments)
  @JoinColumn({ name: 'engineerId' })
  engineer?: FieldEngineerEntity;

  @OneToMany('RepairPhotoEntity', 'assignment', { cascade: true })
  photos?: any[];

  @OneToMany('EngineerCommentEntity', 'assignment', { cascade: true })
  comments?: any[];

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}