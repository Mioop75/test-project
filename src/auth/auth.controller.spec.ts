import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from 'src/user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    registration: jest.fn((dto) => dto),
    login: jest.fn((dto) => dto),
    generateTokens: jest.fn(() => ({
      refreshToken: 'refreshToken',
      accessToken: 'accessToken',
    })),
  };

  const mockUserService = {
    getAll: jest.fn(),
    getOne: jest.fn((dto) => dto),
    create: jest.fn((dto) => dto),
    update: jest.fn((dto) => dto),
    delete: jest.fn(() => 'Пользователь был удален'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {},
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Регистрация пользователя', async () => {
    const newUser = {
      email: 'test@test.test',
      name: 'test123',
      password: 'test123',
    };

    const result = await controller.registration(newUser);

    expect(result).not.toBeNull();
  });

  it('Вход пользователя', async () => {
    const user = {
      email: 'test@test.test',
      name: 'test123',
      password: 'test123',
    };

    const result = await controller.registration(user);

    expect(result).not.toBeNull();
  });
});
