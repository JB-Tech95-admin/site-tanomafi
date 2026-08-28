import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Church } from './entities/church.entity';
import { ContactMessage } from './entities/contact.entity';
import { GalleryItem } from './entities/gallery.entity';
import { Member } from './entities/member.entity';

import { AuthModule } from './auth/auth.module';
import { ChurchesModule } from './churches/churches.module';
import { ContactModule } from './contact/contact.module';
import { GalleryModule } from './gallery/gallery.module';
import { StatsModule } from './stats/stats.module';
import { MembersModule } from './members/members.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'hackermode',
      database: process.env.DB_NAME || 'tanomafi',
      entities: [User, Church, ContactMessage, GalleryItem, Member],
      synchronize: true,
      autoLoadEntities: true,
      retryAttempts: 10,
      retryDelay: 3000,
    }),
    AuthModule,
    ChurchesModule,
    ContactModule,
    GalleryModule,
    StatsModule,
    MembersModule,
    UploadModule,
  ],
})
export class AppModule {}
