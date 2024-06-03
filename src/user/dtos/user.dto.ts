import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';
import { PostDto } from 'src/post/dtos/post.dto';

export class UserDto {
  @Expose()
  id: number;

  @Expose()
  @IsString()
  @IsEmail()
  @ApiProperty()
  email: string;

  @Expose()
  @IsString()
  @ApiProperty()
  name: string;

  @Expose()
  @Type(() => PostDto)
  posts: PostDto[];
}
