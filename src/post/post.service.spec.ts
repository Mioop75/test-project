import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { PostService } from './post.service';

describe('PostService', () => {
  let service: PostService;

  const mockPostRepository = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest
      .fn()
      .mockImplementation((post) =>
        Promise.resolve({ id: Date.now(), ...post }),
      ),
    update: jest.fn().mockImplementation((dto) => dto),
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
        { title: 'hello world', description: 'Hello world' },
        1,
      ),
    ).toEqual({
      id: expect.any(Number),
      title: 'hello world',
      description: 'Hello world',
      author: expect.anything(),
    });
  });
});
