import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { ZOfficerEntity } from './ZOfficer.entity';

@Entity('officer_profile')
export class OfficerProfileEntity {
  @PrimaryGeneratedColumn()
  profileId?: number;

  @Column()
  zoneOfficerId?: number;

  @Column()
  department?: string;

  @Column()
  experienceYears?: number;

  @Column({ type: 'date' })
  joinDate?: Date;

  @OneToOne(() => ZOfficerEntity, (officer) => officer.profile)
  @JoinColumn({ name: 'zoneOfficerId' })
  zoneOfficer?: ZOfficerEntity;
}