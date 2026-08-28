import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Church } from '../entities/church.entity';
import { User } from '../entities/user.entity';
import { ContactMessage } from '../entities/contact.entity';
import { GalleryItem } from '../entities/gallery.entity';
import { Member } from '../entities/member.entity';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(Church) private churchRepo: Repository<Church>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(ContactMessage) private contactRepo: Repository<ContactMessage>,
    @InjectRepository(GalleryItem) private galleryRepo: Repository<GalleryItem>,
    @InjectRepository(Member) private memberRepo: Repository<Member>,
  ) {}

  async getDashboardStats() {
    const churchesCount = await this.churchRepo.count();
    const usersCount = await this.userRepo.count();
    const messagesCount = await this.contactRepo.count();
    const galleryCount = await this.galleryRepo.count();
    const membersCount = await this.memberRepo.count();

    const totalTanoraCount = Math.max(membersCount, usersCount);

    return {
      counters: {
        audio: 24,
        clips: 24,
        awards: 3,
        members: totalTanoraCount,
        churches: churchesCount,
        messages: messagesCount,
        gallery: galleryCount,
      },
      lineChartData: [
        { month: 'Jan', hira: 4, sary_mihetsika: 2, mpikambana: 10 },
        { month: 'Feb', hira: 8, sary_mihetsika: 5, mpikambana: 18 },
        { month: 'Mar', hira: 12, sary_mihetsika: 9, mpikambana: 25 },
        { month: 'Apr', hira: 16, sary_mihetsika: 14, mpikambana: 34 },
        { month: 'May', hira: 20, sary_mihetsika: 18, mpikambana: 42 },
        { month: 'Jun', hira: 24, sary_mihetsika: 24, mpikambana: totalTanoraCount },
      ],
      barChartData: [
        { category: 'Hira', isa: 24, color: '#3b82f6' },
        { category: 'Clip', isa: 24, color: '#8b5cf6' },
        { category: 'Amboara', isa: 3, color: '#f59e0b' },
        { category: 'Fiangonana', isa: churchesCount, color: '#10b981' },
      ],
      pieChartData: [
        { name: 'Prise Vocal', value: 40, color: '#ec4899' },
        { name: 'Tournage Clip', value: 35, color: '#8b5cf6' },
        { name: 'Tafika Masina', value: 25, color: '#3b82f6' },
      ],
    };
  }
}
