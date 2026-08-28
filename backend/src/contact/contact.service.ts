import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactMessage } from '../entities/contact.entity';
import * as nodemailer from 'nodemailer';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);
  private transporter: nodemailer.Transporter;
  private readonly adminEmail = 'andriamirado.heritiana@gmail.com';

  constructor(
    @InjectRepository(ContactMessage)
    private contactRepository: Repository<ContactMessage>,
  ) {
    this.initTransporter();
  }

  private async initTransporter() {
    const smtpHost = process.env.SMTP_HOST;
    const smtpPass = process.env.SMTP_PASS;

    if (smtpHost && smtpPass) {
      this.transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER || this.adminEmail,
          pass: smtpPass,
        },
        connectionTimeout: 5000,
        socketTimeout: 5000,
      });
      this.logger.log(`📧 SMTP Transporter ready`);
    } else {
      this.transporter = nodemailer.createTransport({
        streamTransport: true,
        newline: 'unix',
        buffer: true,
      });
      this.logger.log(`📧 Direct Mailer Stream active`);
    }
  }

  async createMessage(name: string, email: string, message: string): Promise<ContactMessage> {
    if (!name || !email || !message) {
      throw new BadRequestException('Azafady fenoy ny mombamomba rehetra (Anarana, Mailaka, Hafatra) !');
    }

    const contactMsg = this.contactRepository.create({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      sentTo: this.adminEmail,
      isRead: false,
      isReplied: false,
    });

    const saved = await this.contactRepository.save(contactMsg);

    this.sendEmailSafely(saved).catch((err) => {
      this.logger.warn(`Notice mail contact: ${err.message}`);
    });

    return saved;
  }

  private async sendEmailSafely(msg: ContactMessage) {
    try {
      if (!this.transporter) await this.initTransporter();

      const mailOptions = {
        from: `"TANOMAFI Showcase Site" <${msg.email}>`,
        to: this.adminEmail,
        subject: `[TANOMAFI Contact] Hafatra vaovao avy amin'i ${msg.name}`,
        text: `Nouveau message de ${msg.name} (${msg.email}):\n\n${msg.message}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #3b82f6; border-radius: 12px;">
            <h2 style="color: #1e40af;">Hafatra vaovao - TANOMAFI</h2>
            <p><strong>Mpandefa:</strong> ${msg.name} (${msg.email})</p>
            <p><strong>Daty:</strong> ${new Date(msg.createdAt).toLocaleString('fr-FR')}</p>
            <hr style="border: none; border-top: 1px solid #cbd5e1; margin: 20px 0;" />
            <div style="background-color: #ffffff; padding: 15px; border-radius: 8px; border-left: 4px solid #2563eb;">
              ${msg.message}
            </div>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
    } catch (err) {
      this.logger.warn(`Notice mail transport: ${err.message}`);
    }
  }

  // ADMIN REPLY TO CLIENT MESSAGE
  async replyToMessage(id: string, replyText: string): Promise<ContactMessage> {
    if (!replyText || !replyText.trim()) {
      throw new BadRequestException('Azafady soraty ny valin-kafatra (Veuillez rédiger la réponse) !');
    }

    const msg = await this.contactRepository.findOne({ where: { id } });
    if (!msg) {
      throw new NotFoundException('Hafatra tsy hita (Message introuvable)');
    }

    // 1. Send Email Reply to Client
    try {
      if (!this.transporter) await this.initTransporter();

      const mailOptions = {
        from: `"TANOMAFI Administration" <${this.adminEmail}>`,
        to: msg.email,
        subject: `[TANOMAFI] Valin-kafatra momba ny hafatrao (Réponse à votre message)`,
        text: `Manahoana ${msg.name},\n\nInty ny valin'ny hafatrao avy amin'ny Admin TANOMAFI:\n\n${replyText}\n\n---\nHafatrao tany am-boalohany:\n${msg.message}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #2563eb; border-radius: 12px; background-color: #f8fafc;">
            <h2 style="color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 8px;">
              Valin-kafatra TANOMAFI (Réponse Administrateur)
            </h2>
            <p>Manao ahoana <strong>${msg.name}</strong>,</p>
            <p>Inty ny valin'ny hafatrao naterakao tao amin'ny site vitrine TANOMAFI:</p>
            <div style="background-color: #eff6ff; padding: 16px; border-radius: 8px; border-left: 4px solid #1d4ed8; color: #1e3a8a; font-size: 15px; font-weight: 500; margin: 15px 0;">
              ${replyText}
            </div>
            <hr style="border: none; border-top: 1px solid #cbd5e1; margin: 20px 0;" />
            <p style="font-size: 12px; color: #64748b;"><strong>Hafatra nalefanao tany am-boalohany:</strong></p>
            <p style="font-size: 13px; color: #475569; font-style: italic; background-color: #ffffff; p-3; border-radius: 6px;">
              "${msg.message}"
            </p>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      this.logger.log(`✅ Réponse envoyée par mail à ${msg.email}`);
    } catch (err) {
      this.logger.warn(`Notice mail reply: ${err.message}`);
    }

    // 2. Update status in PostgreSQL DB
    msg.isReplied = true;
    msg.isRead = true;
    msg.replyText = replyText.trim();
    msg.repliedAt = new Date();

    return this.contactRepository.save(msg);
  }

  async findAll(): Promise<ContactMessage[]> {
    return this.contactRepository.find({ order: { createdAt: 'DESC' } });
  }

  async markAsRead(id: string): Promise<ContactMessage> {
    await this.contactRepository.update(id, { isRead: true });
    return this.contactRepository.findOne({ where: { id } });
  }

  async remove(id: string): Promise<void> {
    await this.contactRepository.delete(id);
  }
}
