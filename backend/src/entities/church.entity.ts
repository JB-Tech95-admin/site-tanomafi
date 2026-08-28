import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('churches')
export class Church {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'float' })
  latitude: number;

  @Column({ type: 'float' })
  longitude: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  pastor: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  schedule: string;

  @Column({ nullable: true })
  photo: string;

  @CreateDateColumn()
  createdAt: Date;
}
