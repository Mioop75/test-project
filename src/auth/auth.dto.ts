import { Expose, Type } from 'class-transformer';
import { UserDto } from 'src/user/dtos/user.dto';

export class AuthDto {
  @Expose()
  refreshToken: string;

  @Expose()
  accessToken: string;

  @Expose()
  @Type(() => UserDto)
  user: UserDto;
}
