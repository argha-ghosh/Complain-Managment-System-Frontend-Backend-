import {
  Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn,
} from 'typeorm';

@Entity('citizen')
export class CitizenEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name?: string;

  @Column({ unique: true })
  email?: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  nid?: string;

  @CreateDateColumn()
  createdAt?: Date;

  @OneToMany('CitizenComplaintEntity', 'citizen', { cascade: true })
  complaints?: any[];

  @OneToMany('FeedbackEntity', 'citizen', { cascade: true })
  feedbacks?: any[];
}
