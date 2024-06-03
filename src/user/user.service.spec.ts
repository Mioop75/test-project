import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import User from './user.entity';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  const mockUserRepository = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest
      .fn()
      .mockImplementation((user) =>
        Promise.resolve({ id: Date.now(), ...user }),
      ),
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
    expect(
      await service.create({
        email: 'test@test.test',
        name: 'test123',
        password: 'test123',
      }),
    ).toEqual({
      id: expect.any(Number),
      email: 'test@test.test',
      name: 'test123',
      password: expect.anything(),
    });
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
