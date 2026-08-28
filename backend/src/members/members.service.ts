import { Injectable, OnModuleInit, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from '../entities/member.entity';

@Injectable()
export class MembersService implements OnModuleInit {
  constructor(
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
  ) {}

  async onModuleInit() {
    const count = await this.memberRepository.count();
    if (count === 0) {
      const initialMembers = [
        {
          name: 'Heritiana Andriamirado',
          role: 'Responsable Tanora & Admin',
          church: 'Fiangonana Tambohobe',
          photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
          description: 'Mitarika sy mandrindra ny hetsika ara-panahy sy ara-tsosialy rehetra eo anivon\'ny Tanora Manaotsara.',
        },
        {
          name: 'Rasoanaivo Sitraka',
          role: 'Mpitarika Hira & Gitarista',
          church: 'Fiangonana Mitsinjososa',
          photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
          description: 'Mpamorona hira fiderana sy mpampiofana ny tarika prise vocal tanora.',
        },
        {
          name: 'Raveloson Fitiavana',
          role: 'Mpitahiry Vola & Mpikarakara',
          church: 'Fiangonana Soamiafara',
          photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600',
          description: 'Mandamina ny vola sy ny kojakoja ilaina amin\'ireo tafika masina sy fitetezam-paritra.',
        },
        {
          name: 'Rakotoarisoa Faly',
          role: 'Responsable Sary Mihetsika (Clip)',
          church: 'Toby Manaotsara',
          photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600',
          description: 'Mpandray sary sy mpanao montage ho an\'ireo video clips fitoriana filazantsara.',
        },
      ];

      await this.memberRepository.save(initialMembers);
      console.log('✅ Initial Tanora members seeded in PostgreSQL!');
    }
  }

  async findAll(): Promise<Member[]> {
    return this.memberRepository.find({ order: { createdAt: 'ASC' } });
  }

  async findOne(id: string): Promise<Member> {
    const member = await this.memberRepository.findOne({ where: { id } });
    if (!member) throw new NotFoundException('Mpikambana tsy hita');
    return member;
  }

  async create(data: Partial<Member>): Promise<Member> {
    const member = this.memberRepository.create(data);
    return this.memberRepository.save(member);
  }

  async update(id: string, data: Partial<Member>): Promise<Member> {
    await this.memberRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.memberRepository.delete(id);
  }
}
