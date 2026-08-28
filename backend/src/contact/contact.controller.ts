import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactMessage } from '../entities/contact.entity';

@Controller('api/contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  async sendMessage(@Body() body: { name: string; email: string; message: string }) {
    const saved = await this.contactService.createMessage(body.name, body.email, body.message);
    return {
      success: true,
      message: 'Hafatra lasa soa aman-tsara !',
      data: saved,
    };
  }

  @Post(':id/reply')
  async replyMessage(@Param('id') id: string, @Body() body: { replyText: string }) {
    const updated = await this.contactService.replyToMessage(id, body.replyText);
    return {
      success: true,
      message: 'Valin-kafatra lasa soa aman-tsara ho an\'ny mpampiasa !',
      data: updated,
    };
  }

  @Get()
  async findAll(): Promise<ContactMessage[]> {
    return this.contactService.findAll();
  }

  @Put(':id/read')
  async markAsRead(@Param('id') id: string): Promise<ContactMessage> {
    return this.contactService.markAsRead(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ success: boolean }> {
    await this.contactService.remove(id);
    return { success: true };
  }
}
