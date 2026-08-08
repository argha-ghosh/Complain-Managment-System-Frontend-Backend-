import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { AdminEntity } from './admin.entity';

// NOTE: This is the admin module's own ZoneOfficer table.
// It is separate from the 'zone_officer' table used in the ZOfficer module.
// Table name: 'admin_zone_officer' to avoid conflict.
@Entity('admin_zone_officer')
export class ZoneOfficerEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name?: string;

  @Column()
  zone?: string;

  // Many-to-One: Many officers belong to one Admin
  @ManyToOne(() => AdminEntity, (admin) => admin.zoneOfficers)
  admin?: AdminEntity;
}
