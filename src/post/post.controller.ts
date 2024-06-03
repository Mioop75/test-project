import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { AuthGuard } from 'src/auth/authGuard';
import {
  Filtering,
  FilteringParams,
} from 'src/shared/decorators/filter.decorator';
import {
  Pagination,
  PaginationParams,
} from 'src/shared/decorators/pagination.decorator';
import { User } from 'src/user/user.decorator';
import { InputPostDto } from './dtos/input-post.dto';
import { PostPaginationDto } from './dtos/post-pagination.dto';
import { PostDto } from './dtos/post.dto';
import { PostService } from './post.service';

@ApiTags('posts')
@Controller('posts')
export class PostController {
  constructor(
    private readonly postService: PostService,
    @Inject(CACHE_MANAGER) private readonly cacheService: Cache,
  ) {}

  @ApiOperation({ description: 'Получение всех постов' })
  @Get()
  async getAll(
    @PaginationParams() paginationParams: Pagination,
    @FilteringParams(['title', 'author.id', 'author.name']) filter?: Filtering,
  ) {
    const posts = await this.postService.getAll(paginationParams, filter);

    await this.cacheService.set('posts', posts);

    return plainToInstance(PostPaginationDto, posts);
  }

  @ApiOperation({ description: 'Получение одного поста' })
  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number) {
    const post = await this.postService.getOne(id);

    await this.cacheService.set(`post/${post.id}`, post);

    return plainToInstance(PostDto, post);
  }

  @ApiOperation({ description: 'Создание поста' })
  @UseGuards(AuthGuard)
  @Post()
  async create(@User('id') userId: number, @Body() dto: InputPostDto) {
    const createdPost = await this.postService.create(dto, userId);

    return plainToInstance(PostDto, createdPost);
  }

  @ApiOperation({ description: 'Обновление поста' })
  @UseGuards(AuthGuard)
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) postId: number,
    @User('id') userId: number,
    @Body() dto: InputPostDto,
  ) {
    await this.cacheService.del(`post/${postId}`);
    await this.cacheService.del(`posts`);
    const updatedPost = await this.postService.update(userId, postId, dto);

    return plainToInstance(PostDto, updatedPost);
  }

  @ApiOperation({ description: 'Удаление поста' })
  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) postId: number,
    @User('id') userId: number,
  ) {
    await this.cacheService.del(`post/${postId}`);
    await this.cacheService.del(`posts`);
    return await this.postService.delete(userId, postId);
  }
}
