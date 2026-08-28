import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { GalleryItem } from '../entities/gallery.entity';

@Controller('api/gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Get()
  async findAll(): Promise<GalleryItem[]> {
    return this.galleryService.findAll();
  }

  @Post()
  async create(@Body() data: Partial<GalleryItem>): Promise<GalleryItem> {
    return this.galleryService.create(data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ success: boolean }> {
    await this.galleryService.remove(id);
    return { success: true };
  }
}
