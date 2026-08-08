import { Entity, Column, PrimaryGeneratedColumn, OneToOne, OneToMany } from 'typeorm';
import { ProfileEntity } from './profile.entity';
import { ZoneOfficerEntity } from './zoneOfficer.entity';

@Entity('admin')
export class AdminEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name?: string;

  @Column()
  email?: string;

  @Column()
  password?: string;

  @Column()
  gender?: string;

  @Column()
  phone_number?: string;

  @Column()
  filename?: string;

  // One-to-One: Admin has one Profile
  @OneToOne(() => ProfileEntity, (profile) => profile.admin)
  profile!: ProfileEntity;

  // One-to-Many: Admin manages many ZoneOfficers
  @OneToMany(() => ZoneOfficerEntity, (officer) => officer.admin)
  zoneOfficers!: ZoneOfficerEntity[];
}
