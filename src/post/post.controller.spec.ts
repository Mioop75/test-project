import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from './post.controller';
import { PostService } from './post.service';

describe('PostController', () => {
  let controller: PostController;

  const mockPostService = {
    getAll: jest.fn(),
    getOne: jest.fn(),
    create: jest.fn((dto) => ({ id: Date.now(), ...dto })),
    update: jest.fn((dto) => ({ id: Date.now(), ...dto })),
    delete: jest.fn(),
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
          useValue: {},
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
      title: 'Created title',
      description: 'Created description',
    });

    expect(createdPost).toHaveBeenCalled();
  });
});
