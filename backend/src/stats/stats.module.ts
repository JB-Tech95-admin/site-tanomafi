import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Church } from '../entities/church.entity';
import { User } from '../entities/user.entity';
import { ContactMessage } from '../entities/contact.entity';
import { GalleryItem } from '../entities/gallery.entity';
import { Member } from '../entities/member.entity';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Church, User, ContactMessage, GalleryItem, Member])],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
