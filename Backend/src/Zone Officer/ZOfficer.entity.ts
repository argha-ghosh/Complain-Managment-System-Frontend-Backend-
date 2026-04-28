import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn, OneToOne } from 'typeorm';

@Entity("zone_officer")
export class ZOfficerEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name?: string;

  @Column()
  email?: string;

  @Column({ nullable: true })
  password?: string;

  @Column()
  nid?: string;

  // One-to-Many: ZOfficer has many Complaints
  @OneToMany(() => ComplaintEntity, (complaint) => complaint.zoneOfficer, { cascade: true })
  complaints?: ComplaintEntity[];
  profile?: OfficerProfileEntity;
}

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

  // One-to-One relationship with ZOfficer
  @OneToOne(() => ZOfficerEntity)
  @JoinColumn({ name: 'zoneOfficerId' })
  zoneOfficer?: ZOfficerEntity;
}

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

  // Many-to-One: Complaint belongs to one ZOfficer
  @ManyToOne(() => ZOfficerEntity, (zoneOfficer) => zoneOfficer.complaints)
  @JoinColumn({ name: 'zoneOfficerId' })
  zoneOfficer?: ZOfficerEntity;
}