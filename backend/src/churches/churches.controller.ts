import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ChurchesService } from './churches.service';
import { Church } from '../entities/church.entity';

@Controller('api/churches')
export class ChurchesController {
  constructor(private readonly churchesService: ChurchesService) {}

  @Get()
  async findAll(): Promise<Church[]> {
    return this.churchesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Church> {
    return this.churchesService.findOne(id);
  }

  @Post()
  async create(@Body() data: Partial<Church>): Promise<Church> {
    return this.churchesService.create(data);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: Partial<Church>): Promise<Church> {
    return this.churchesService.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ success: boolean }> {
    await this.churchesService.remove(id);
    return { success: true };
  }
}
