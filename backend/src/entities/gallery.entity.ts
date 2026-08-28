import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('gallery_items')
export class GalleryItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ default: 'nature' })
  category: string; // 'nature' | 'energie' | 'recyclage' | 'all'

  @Column()
  image: string;

  @Column({ type: 'text', nullable: true })
  desc: string;

  @CreateDateColumn()
  createdAt: Date;
}
