import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from './post.controller';
import { PostService } from './post.service';

describe('PostController', () => {
  let controller: PostController;

  const mockPost = {
    id: 1,
    title: 'test post',
    description: 'test description',
    author: {
      id: 1,
      email: 'test@test.test',
      name: 'test123',
      password: 'test123',
    },
  };

  const mockPostService = {
    getAll: jest.fn(),
    getOne: jest.fn(),
    create: jest.fn(() => Promise.resolve(mockPost)),
    update: jest.fn(() => Promise.resolve(mockPost)),
    delete: jest.fn(),
  };

  const mockCacheService = {
    del: jest.fn(),
    set: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [
        PostService,
        {
          provide: JwtService,
          useValue: {},
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheService,
        },
        ConfigService,
      ],
    })
      .overrideProvider(PostService)
      .useValue(mockPostService)
      .compile();

    controller = module.get<PostController>(PostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Создание поста', async () => {
    const createdPost = jest.spyOn(controller, 'create');

    await controller.create(1, {
      title: 'test post',
      description: 'test description',
    });

    expect(createdPost).toHaveBeenCalled();
  });

  it('Обновить пост', async () => {
    const updatedPost = jest.spyOn(controller, 'update');

    await controller.update(1, 1, {
      title: 'test post',
      description: 'test description',
    });

    expect(updatedPost).toHaveBeenCalled();
  });

  it('Удалить пост', async () => {
    const deletedPost = jest.spyOn(controller, 'delete');

    await controller.delete(1, 1);

    expect(deletedPost).toHaveBeenCalled();
  });
});
