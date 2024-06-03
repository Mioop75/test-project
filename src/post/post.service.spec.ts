import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { PostService } from './post.service';

describe('PostService', () => {
  let service: PostService;

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

  const mockPostRepository = {
    create: jest.fn(),
    save: jest.fn(() => Promise.resolve(mockPost)),
    update: jest.fn(),
    findOneOrFail: jest.fn(() => Promise.resolve(mockPost)),
    findOneBy: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        { provide: getRepositoryToken(Post), useValue: mockPostRepository },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Создать пост', async () => {
    expect(
      await service.create(
        { title: 'test post', description: 'test description' },
        1,
      ),
    ).toEqual({
      id: expect.any(Number),
      title: 'test post',
      description: 'test description',
      author: expect.anything(),
    });
  });

  it('Обновить пост', async () => {
    const updatedPost = jest.spyOn(service, 'update');

    await service.update(1, 1, {
      title: 'test post',
      description: 'test description',
    });

    expect(updatedPost).toHaveBeenCalled();
  });

  it('Удалить пост', async () => {
    const deletedPost = jest.spyOn(service, 'delete');

    await service.delete(1, 1);

    expect(deletedPost).toHaveBeenCalled();
  });
});
