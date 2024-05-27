import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>) {
  }

 async create(email: string, password: string) {
    const user = await this.userRepo.create({ email, password });

    return await this.userRepo.save(user);
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async findAll(email: string) {
    return await this.userRepo.find({ where: { email } });
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne(id);

    return await this.userRepo.save(Object.assign(user, attrs));
  }

  async remove(id: number) {
    const user = await this.findOne(id);

    return await this.userRepo.remove(user);
  }
}
