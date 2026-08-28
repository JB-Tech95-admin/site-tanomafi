import { Injectable, OnModuleInit, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Church } from '../entities/church.entity';

@Injectable()
export class ChurchesService implements OnModuleInit {
  constructor(
    @InjectRepository(Church)
    private churchRepository: Repository<Church>,
  ) {}

  async onModuleInit() {
    const count = await this.churchRepository.count();
    if (count === 0) {
      const initialChurches = [
        {
          name: 'Fiangonana Tambohobe',
          latitude: -21.443080,
          longitude: 47.086902,
          address: 'Tambohobe, Fianarantsoa',
          pastor: 'Pasteur Raharison',
          phone: '+261 34 12 345 67',
          schedule: 'Alahady 06:00 & 09:00, Sabotsy (Tanora) 15:00',
          description: 'Fiangonana lehibe sy manan-daza eto Fianarantsoa misy ny sampana Tanora dynamique sy mavitrika.',
          photo: 'https://images.unsplash.com/photo-1548625361-195fe5772323?auto=format&fit=crop&q=80&w=800',
        },
        {
          name: 'Fiangonana Mitsinjososa',
          latitude: -21.432157,
          longitude: 47.095955,
          address: 'Mitsinjososa, Fianarantsoa',
          pastor: 'Pasteur Randria',
          phone: '+261 34 98 765 43',
          schedule: 'Alahady 08:30, Zoma (Tafika Masina) 17:00',
          description: 'Toerana fiderana sy fampiofanana tanora amin\'ny fitoriana filazantsara.',
          photo: 'https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&q=80&w=800',
        },
        {
          name: 'Fiangonana Soamiafara',
          latitude: -21.431784,
          longitude: 47.116308,
          address: 'Soamiafara, Fianarantsoa',
          pastor: 'Pasteur Rakotomalala',
          phone: '+261 32 44 112 23',
          schedule: 'Alahady 09:00',
          description: 'Fiangonana mitaiza ny tanora sy manohana ny asa soa ara-tsosialy.',
          photo: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&q=80&w=800',
        },
        {
          name: 'Toby Manaotsara',
          latitude: -21.447011,
          longitude: 47.104332,
          address: 'Toby FFSM, Fianarantsoa',
          pastor: 'Mpiandry & Pasteur',
          phone: '+261 38 54 549 00',
          schedule: 'Sabotsy & Alahady, Komy isan\'andro 12:00',
          description: 'Toby lehibe famonjena sy fanasitranana ary toeran\'ny fampaherezana saina sy fanahy.',
          photo: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&q=80&w=800',
        },
        {
          name: 'Fiangonana Manaotsara',
          latitude: -21.449015,
          longitude: 47.103356,
          address: 'Manaotsara, Fianarantsoa',
          pastor: 'Pasteur Andriamanitra',
          phone: '+261 33 55 667 88',
          schedule: 'Alahady 06:30 & 09:30',
          description: 'Kolejy sy fiangonana fitoriana ny tenin\'ny Andriamanitra.',
          photo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800',
        },
        {
          name: 'Fiangonana Mangarivotra',
          latitude: -21.440634,
          longitude: 47.116734,
          address: 'Mangarivotra, Fianarantsoa',
          pastor: 'Pasteur Rabe',
          phone: '+261 34 77 889 90',
          schedule: 'Alahady 08:30',
          description: 'Mampianatra sy mandray tanora rehetra te hiditra mpikambana.',
          photo: 'https://images.unsplash.com/photo-1510519138161-584462963c63?auto=format&fit=crop&q=80&w=800',
        },
      ];

      await this.churchRepository.save(initialChurches);
      console.log('✅ Initial churches seeded into database');
    }
  }

  async findAll(): Promise<Church[]> {
    return this.churchRepository.find({ order: { name: 'ASC' } });
  }

  async findOne(id: string): Promise<Church> {
    const church = await this.churchRepository.findOne({ where: { id } });
    if (!church) throw new NotFoundException('Fiangonana tsy hita');
    return church;
  }

  async create(data: Partial<Church>): Promise<Church> {
    const church = this.churchRepository.create(data);
    return this.churchRepository.save(church);
  }

  async update(id: string, data: Partial<Church>): Promise<Church> {
    await this.churchRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.churchRepository.delete(id);
  }
}
