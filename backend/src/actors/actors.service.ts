import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Actor } from '../entities/actor.entity';
import { CreateActorDto, UpdateActorDto, SearchActorDto } from '../dto/actor.dto';

@Injectable()
export class ActorsService {
  constructor(
    @InjectRepository(Actor)
    private actorsRepository: Repository<Actor>,
  ) {}

  async create(createActorDto: CreateActorDto): Promise<Actor> {
    const actor = this.actorsRepository.create({
      ...createActorDto,
      birthDate: new Date(createActorDto.birthDate),
    });
    return this.actorsRepository.save(actor);
  }

  async findAll(): Promise<Actor[]> {
    return this.actorsRepository.find({
      relations: ['movies'],
    });
  }

  async findOne(id: number): Promise<Actor> {
    const actor = await this.actorsRepository.findOne({
      where: { id },
      relations: ['movies'],
    });

    if (!actor) {
      throw new NotFoundException(`Actor with ID ${id} not found`);
    }

    return actor;
  }

  async search(searchDto: SearchActorDto): Promise<Actor[]> {
    const whereConditions: any = {};

    if (searchDto.name) {
      whereConditions.name = Like(`%${searchDto.name}%`);
    }

    if (searchDto.nationality) {
      whereConditions.nationality = Like(`%${searchDto.nationality}%`);
    }

    return this.actorsRepository.find({
      where: whereConditions,
      relations: ['movies'],
    });
  }

  async update(id: number, updateActorDto: UpdateActorDto): Promise<Actor> {
    const actor = await this.findOne(id);

    const updateData: any = { ...updateActorDto };
    if (updateActorDto.birthDate) {
      updateData.birthDate = new Date(updateActorDto.birthDate);
    }

    Object.assign(actor, updateData);
    return this.actorsRepository.save(actor);
  }

  async remove(id: number): Promise<void> {
    const actor = await this.findOne(id);
    await this.actorsRepository.remove(actor);
  }

  async getMoviesByActor(id: number): Promise<Actor> {
    return this.findOne(id);
  }
} 