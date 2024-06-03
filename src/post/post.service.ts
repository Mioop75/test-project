import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Filtering } from 'src/shared/decorators/filter.decorator';
import { Pagination } from 'src/shared/decorators/pagination.decorator';
import { getWhere } from 'src/shared/helpers/typeorm.helpers';
import { Repository } from 'typeorm';
import { InputPostDto } from './dtos/input-post.dto';
import { Post as PostEntity } from './post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {}

  async getAll({ page, limit, size, offset }: Pagination, filter?: Filtering) {
    const where = getWhere(filter);

    const [posts, count] = await this.postRepository.findAndCount({
      where,
      order: {
        created_at: 'DESC',
      },
      take: limit,
      skip: offset,
      relations: ['author'],
      select: {
        author: {
          password: false,
        },
      },
    });

    return {
      posts,
      total: count,
      page,
      size,
    };
  }

  async getOne(id: number) {
    try {
      return await this.postRepository.findOneOrFail({
        where: { id },
        relations: { author: true },
        select: {
          author: {
            password: false,
          },
        },
      });
    } catch (error) {
      throw new NotFoundException('Статья не найдена');
    }
  }

  async create(dto: InputPostDto, userId: number) {
    const createdPost = this.postRepository.create({
      ...dto,
      author: { id: userId },
    });
    return await this.postRepository.save(createdPost);
  }

  async update(userId: number, postId: number, dto: InputPostDto) {
    const oldPost = await this.getOne(postId);

    if (oldPost.author.id !== userId)
      throw new UnauthorizedException('Вы не автор этой статьи');

    await this.postRepository.update(postId, dto);

    return await this.getOne(postId);
  }

  async delete(userId: number, postId: number) {
    const oldPost = await this.getOne(postId);

    if (oldPost.author.id !== userId)
      throw new UnauthorizedException('Вы не автор этой статьи');

    await this.postRepository.delete(postId);

    return 'Статья была удалена';
  }
}
