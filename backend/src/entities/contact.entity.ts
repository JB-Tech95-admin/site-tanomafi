import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('contact_messages')
export class ContactMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ default: 'andriamirado.heritiana@gmail.com' })
  sentTo: string;

  @Column({ default: false })
  isRead: boolean;

  @Column({ default: false })
  isReplied: boolean;

  @Column({ type: 'text', nullable: true })
  replyText: string;

  @Column({ type: 'timestamp', nullable: true })
  repliedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
