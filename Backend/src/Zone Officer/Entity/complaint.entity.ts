import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ZOfficerEntity } from './ZOfficer.entity';

@Entity('complaint')
export class ComplaintEntity {
  @PrimaryGeneratedColumn()
  complaintId?: number;

  @Column({ nullable: true })
  zoneOfficerId?: number;

  @Column()
  zoneName?: string;

  @Column()
  areaName?: string;

  @Column()
  description?: string;

  @Column()
  status?: string;

  @ManyToOne(() => ZOfficerEntity, (zoneOfficer) => zoneOfficer.complaints)
  @JoinColumn({ name: 'zoneOfficerId' })
  zoneOfficer?: ZOfficerEntity;
}