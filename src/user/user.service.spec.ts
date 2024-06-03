import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import User from './user.entity';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  const mockUser = {
    id: 1,
    email: 'test@test.test',
    name: 'test123',
    password: 'test123',
  };

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(() => Promise.resolve(mockUser)),
    update: jest.fn(),
    findOneBy: jest.fn(),
    findOne: jest.fn(),
    findOneOrFail: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Создать пользователя и вернуть его', async () => {
    const newUser = {
      id: 1,
      email: 'test@test.test',
      name: 'test',
      password: 'test123',
    };

    const result = await service.create(newUser);

    expect(result).toEqual(mockUser);
  });

  it('Обновить пользователя', async () => {
    const updateUserSpy = jest.spyOn(service, 'update');

    await service.update(1, {
      email: 'updatedUser@test.test',
      name: 'updatedUser',
      password: 'test123',
    }),
      expect(updateUserSpy).toHaveBeenCalled();
  });

  it('Удалить пользователя', async () => {
    const user = await service.create({
      email: 'test@test.test',
      name: 'test123',
      password: 'test123',
    });

    expect(await service.delete(user.id)).toBe('Пользователь был удален');
  });
});
