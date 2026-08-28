import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GalleryItem } from '../entities/gallery.entity';

@Injectable()
export class GalleryService implements OnModuleInit {
  constructor(
    @InjectRepository(GalleryItem)
    private galleryRepository: Repository<GalleryItem>,
  ) {}

  async onModuleInit() {
    const count = await this.galleryRepository.count();
    if (count === 0) {
      const initialItems = [
        {
          title: 'Hetsika Fitoriana Filazantsara',
          category: 'nature',
          image: '/image/mt1.png',
          desc: 'Tanora nitory filazantsara tamin\'ny alalan\'ny hira sy kabary.',
        },
        {
          title: 'Fifaninanana Hira',
          category: 'energie',
          image: '/image/clip.png',
          desc: 'Fahazoana amboara teo amin\'ny fifaninanana chorale tanora.',
        },
        {
          title: 'Tournage Clip',
          category: 'recyclage',
          image: '/image/fanentanana.png',
          desc: 'Fanaovana clip fitoriana lehibe tao Fianarantsoa.',
        },
      ];

      await this.galleryRepository.save(initialItems);
      console.log('✅ Initial gallery items seeded');
    }
  }

  async findAll(): Promise<GalleryItem[]> {
    return this.galleryRepository.find({ order: { createdAt: 'DESC' } });
  }

  async create(data: Partial<GalleryItem>): Promise<GalleryItem> {
    const item = this.galleryRepository.create(data);
    return this.galleryRepository.save(item);
  }

  async remove(id: string): Promise<void> {
    await this.galleryRepository.delete(id);
  }
}
