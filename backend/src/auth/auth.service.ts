import { Injectable, UnauthorizedException, BadRequestException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async onModuleInit() {
    // Automatically seed default Admin in PostgreSQL if not exists
    try {
      const adminEmail = 'admin@tanomafi.mg';
      let admin = await this.userRepository.findOne({ where: { email: adminEmail } });
      if (!admin) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await this.userRepository.save({
          name: 'Admin Tanomafi',
          email: adminEmail,
          password: hashedPassword,
          role: 'admin',
        });
        console.log('✅ Default Admin seeded in PostgreSQL: admin@tanomafi.mg / admin123');
      }
    } catch (err) {
      console.warn('⚠️ Admin seed warning:', err.message);
    }
  }

  async login(email: string, pass: string) {
    if (!email || !pass) {
      throw new BadRequestException('Azafady fenoy ny mailaka sy teny miafina !');
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Check if email ends with @tanomafi.mg
    if (!trimmedEmail.endsWith('@tanomafi.mg')) {
      throw new BadRequestException('Ny mailaka dia tsy maintsy mifarana amin\'ny @tanomafi.mg');
    }

    const user = await this.userRepository.findOne({ where: { email: trimmedEmail } });
    if (!user) {
      throw new UnauthorizedException('Mailaka na teny miafina diso ! Tsy misy ity kaonty ity.');
    }

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Mailaka na teny miafina diso !');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async register(name: string, email: string, pass: string) {
    if (!name || !email || !pass) {
      throw new BadRequestException('Azafady fenoy ny mombamomba rehetra !');
    }

    const trimmedEmail = email.trim().toLowerCase();

    // STRICT RULE: Email MUST end with @tanomafi.mg
    if (!trimmedEmail.endsWith('@tanomafi.mg')) {
      throw new BadRequestException('Ny mailaka dia tsy maintsy mifarana amin\'ny @tanomafi.mg (Ex: anarana@tanomafi.mg)');
    }

    const existing = await this.userRepository.findOne({ where: { email: trimmedEmail } });
    if (existing) {
      throw new BadRequestException('Efa misy mampiasa io mailaka io !');
    }

    const hashedPassword = await bcrypt.hash(pass, 10);
    const newUser = await this.userRepository.save({
      name: name.trim(),
      email: trimmedEmail,
      password: hashedPassword,
      role: 'user',
    });

    const payload = { sub: newUser.id, email: newUser.email, role: newUser.role };
    return {
      token: this.jwtService.sign(payload),
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    };
  }

  async getUsers() {
    return this.userRepository.find({
      select: ['id', 'name', 'email', 'role', 'createdAt'],
      order: { createdAt: 'DESC' },
    });
  }
}
