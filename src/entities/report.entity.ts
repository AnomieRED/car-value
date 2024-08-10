import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  price: number;

  @Column()
  year: number;

  @Column()
  make: string;

  @Column()
  model: string;

  @Column()
  lng: number;

  @Column()
  lat: number;

  @Column()
  mileage: number;

  @Column({ default: false })
  isApproved: boolean;

  @ManyToOne(() => User, user => user.Reports)
  User: User;
}