import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsString } from 'class-validator';
import { UserDto } from 'src/user/dtos/user.dto';

export class PostDto {
  @Expose()
  id: number;

  @Expose()
  @IsString()
  @ApiProperty()
  title: string;

  @Expose()
  @IsString()
  @ApiProperty()
  description: string;

  @Expose()
  @Type(() => UserDto)
  author: UserDto;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;
}
