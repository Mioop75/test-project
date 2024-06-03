import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;

  const mockUser = {
    id: 1,
    email: 'test@test.test',
    name: 'test123',
    password: 'test123',
  };

  const mockUserService = {
    getAll: jest.fn(),
    getOne: jest.fn(() => mockUser),
    update: jest.fn(() => mockUser),
    delete: jest.fn(() => 'Пользователь был удален'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: JwtService,
          useValue: {},
        },
      ],
      imports: [ConfigModule],
    })
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Получить пользователя', async () => {
    expect(await controller.getOne(1)).toEqual(mockUser);
  });

  it('Обновить пользователя', async () => {
    const updateUserSpy = jest.spyOn(controller, 'update');

    await controller.update(1, {
      email: 'updatedUser@test.test',
      name: 'updatedUser',
      password: 'test123',
    });

    expect(updateUserSpy).toHaveBeenCalled();
  });

  it('Удалить пользователя', async () => {
    expect(await controller.delete(1)).toBe('Пользователь был удален');
  });
});
