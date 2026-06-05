import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne,
  JoinColumn, CreateDateColumn,
} from 'typeorm';
import { CitizenEntity } from './citizen.entity';

@Entity('feedback')
export class FeedbackEntity {
  @PrimaryGeneratedColumn()
  feedbackId?: number;

  @Column({ type: 'int' })
  rating?: number;        // 1 – 5

  @Column({ type: 'text', nullable: true })
  comment?: string;

  // ── Citizen FK 
  @Column({ nullable: true })
  citizenId?: number;

  @ManyToOne(() => CitizenEntity, (citizen) => citizen.feedbacks, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'citizenId' })
  citizen?: CitizenEntity;

  // ── Complaint FK (One-to-One) 
  @Column({ nullable: true })
  complaintId?: number;

  @OneToOne('CitizenComplaintEntity', 'feedback', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'complaintId' })
  complaint?: any;

  @CreateDateColumn()
  createdAt?: Date;
}
