import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { MembersService } from './members.service';
import { Member } from '../entities/member.entity';

@Controller('api/members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Get()
  async findAll(): Promise<Member[]> {
    return this.membersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Member> {
    return this.membersService.findOne(id);
  }

  @Post()
  async create(@Body() data: Partial<Member>): Promise<Member> {
    return this.membersService.create(data);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: Partial<Member>): Promise<Member> {
    return this.membersService.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ success: boolean }> {
    await this.membersService.remove(id);
    return { success: true };
  }
}
