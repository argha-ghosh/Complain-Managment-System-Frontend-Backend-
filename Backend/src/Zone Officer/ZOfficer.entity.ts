import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne } from 'typeorm';
import { ComplaintEntity } from './complaint.entity';
import { OfficerProfileEntity } from './officer-profile.entity';

@Entity('zone_officer')
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

  @OneToMany(() => ComplaintEntity, (complaint) => complaint.zoneOfficer, {
    cascade: true,
  })
  complaints?: ComplaintEntity[];

  @OneToOne(() => OfficerProfileEntity, (profile) => profile.zoneOfficer)
  profile?: OfficerProfileEntity;
}