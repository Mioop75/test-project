import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { genSalt, hash } from 'bcrypt';
import { Repository } from 'typeorm';
import { InputUserDto } from './dtos/input-user.dto';
import User from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async getAll() {
    return this.usersRepository.find();
  }

  async getOne(id: number) {
    try {
      return await this.usersRepository.findOneOrFail({
        where: { id },
        relations: { posts: true },
      });
    } catch (error) {
      throw new NotFoundException('Пользователь не найден');
    }
  }

  async getUserByName(name: string) {
    try {
      return await this.usersRepository.findOneOrFail({ where: { name } });
    } catch (error) {
      throw new NotFoundException('Пользователь не найден');
    }
  }

  async create(dto: InputUserDto) {
    const existedUser = await this.usersRepository.findOneBy({
      name: dto.name,
    });

    if (existedUser)
      throw new BadRequestException(
        'Пользователь с таким именем уже существуте',
      );

    const salt = await genSalt(8);
    const hashedPassword = await hash(dto.password, salt);

    const createdUser = this.usersRepository.create({
      ...dto,
      password: hashedPassword,
    });

    return await this.usersRepository.save(createdUser);
  }

  async update(id: number, dto: InputUserDto) {
    await this.usersRepository.update(id, dto);

    return await this.usersRepository.findOne({ where: { id } });
  }

  async delete(id: number) {
    await this.usersRepository.delete(id);
    return 'Пользователь был удален';
  }
}
