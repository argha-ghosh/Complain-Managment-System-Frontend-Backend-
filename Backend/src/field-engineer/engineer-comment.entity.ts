import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn, CreateDateColumn,
} from 'typeorm';
import { EngineerAssignmentEntity } from './engineer-assignment.entity';

@Entity('engineer_comment')
export class EngineerCommentEntity {
  @PrimaryGeneratedColumn()
  commentId?: number;

  @Column()
  assignmentId?: number;

  @Column({ type: 'text' })
  comment?: string;

  @Column({ nullable: true })
  engineerId?: number;

  @ManyToOne(() => EngineerAssignmentEntity, (assignment) => assignment.comments)
  @JoinColumn({ name: 'assignmentId' })
  assignment?: EngineerAssignmentEntity;

  @CreateDateColumn()
  createdAt?: Date;
}