import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn, CreateDateColumn,
} from 'typeorm';
import { EngineerAssignmentEntity } from './engineer-assignment.entity';

@Entity('repair_photo')
export class RepairPhotoEntity {
  @PrimaryGeneratedColumn()
  photoId?: number;

  @Column()
  assignmentId?: number;

  @Column()
  imageUrl?: string;

  @Column({ type: 'text', nullable: true })
  caption?: string;

  @ManyToOne(() => EngineerAssignmentEntity, (assignment) => assignment.photos)
  @JoinColumn({ name: 'assignmentId' })
  assignment?: EngineerAssignmentEntity;

  @CreateDateColumn()
  uploadedAt?: Date;
}