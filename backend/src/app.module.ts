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
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const isProduction = process.env.NODE_ENV === 'production' || !!process.env.DATABASE_URL || process.env.DB_SSL === 'true';
        if (process.env.DATABASE_URL) {
          return {
            type: 'postgres',
            url: process.env.DATABASE_URL,
            entities: [User, Church, ContactMessage, GalleryItem, Member],
            synchronize: true,
            autoLoadEntities: true,
            ssl: { rejectUnauthorized: false },
            retryAttempts: 10,
            retryDelay: 3000,
          };
        }
        return {
          type: 'postgres',
          host: process.env.DB_HOST || 'localhost',
          port: Number(process.env.DB_PORT) || 5432,
          username: process.env.DB_USERNAME || 'postgres',
          password: process.env.DB_PASSWORD || 'hackermode',
          database: process.env.DB_NAME || 'tanomafi',
          entities: [User, Church, ContactMessage, GalleryItem, Member],
          synchronize: true,
          autoLoadEntities: true,
          ssl: isProduction ? { rejectUnauthorized: false } : false,
          retryAttempts: 10,
          retryDelay: 3000,
        };
      },
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
