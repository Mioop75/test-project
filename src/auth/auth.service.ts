import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { UserDto } from 'src/user/dtos/user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(user: UserDto & { password: string }, password: string) {
    const verifiedPassword = await compare(password, user.password);

    if (!verifiedPassword)
      throw new UnauthorizedException('Неправильный пароль');

    const tokens = await this.generateTokens({ id: user.id, name: user.name });

    return tokens;
  }

  async generateTokens(payload: { id: number; name: string }) {
    return {
      accessToken: await this.jwtService.signAsync(payload),
      refreshToken: await this.jwtService.signAsync(payload, {
        expiresIn: '30d',
      }),
    };
  }
}
