import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn,
  OneToOne, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';
import { CitizenEntity } from './citizen.entity';

@Entity('citizen_complaint')
export class CitizenComplaintEntity {
  @PrimaryGeneratedColumn()
  complaintId?: number;

  // ── Location Hierarchy 
  @Column({ nullable: false })
  corporation!: string;   // e.g. "Dhaka North City Corporation"

  @Column({ nullable: false })
  zone!: string;           // e.g. "Zone-1"

  @Column({ nullable: false })
  ward!: string;           // e.g. "Ward-10"

  // ── Complaint Details 
  @Column({ nullable: false })
  title!: string;

  @Column({ type: 'text', nullable: false })
  description!: string;

  @Column({ nullable: true })
  imageUrl?: string;       // uploaded image filename/path

  @Column({ default: 'Pending' })
  status?: string;         // Pending | In Progress | Resolved | Rejected

  // ── Citizen FK 
  @Column({ nullable: true })
  citizenId?: number;

  @ManyToOne(() => CitizenEntity, (citizen) => citizen.complaints, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'citizenId' })
  citizen?: CitizenEntity;

  // ── Feedback (One-to-One) 
  @OneToOne('FeedbackEntity', 'complaint', { cascade: true, nullable: true })
  feedback?: any;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
