import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { AdminEntity } from './admin.entity';

@Entity('admin_profile')
export class ProfileEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  address?: string;

  @Column()
  department?: string;

  // JoinColumn lives here — this side owns the FK
  @OneToOne(() => AdminEntity, (admin) => admin.profile)
  @JoinColumn()
  admin?: AdminEntity;
}
