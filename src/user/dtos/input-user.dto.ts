import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';
import { UserDto } from './user.dto';

export class InputUserDto extends PickType(UserDto, [
  'email',
  'name',
] as const) {
  @IsString()
  @Length(4)
  @ApiProperty()
  password: string;
}
