import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { InputUserDto } from 'src/user/dtos/input-user.dto';
import { UserService } from 'src/user/user.service';
import { AuthDto } from './auth.dto';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @ApiOperation({ description: 'Вход' })
  @Post('login')
  async login(@Body() dto: InputUserDto) {
    const foundUser = await this.userService.getUserByName(dto.name);
    const { refreshToken, accessToken } = await this.authService.login(
      foundUser,
      dto.password,
    );

    return plainToInstance(AuthDto, {
      refreshToken,
      accessToken,
      user: foundUser,
    });
  }

  @ApiOperation({ description: 'Регистрация' })
  @Post('registration')
  async registration(@Body() dto: InputUserDto) {
    const createdUser = await this.userService.create(dto);
    const { refreshToken, accessToken } =
      await this.authService.generateTokens(createdUser);

    return plainToInstance(AuthDto, {
      refreshToken,
      accessToken,
      user: createdUser,
    });
  }
}
