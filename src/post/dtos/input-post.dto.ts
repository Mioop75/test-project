import { PickType } from '@nestjs/swagger';
import { PostDto } from './post.dto';

export class InputPostDto extends PickType(PostDto, [
  'title',
  'description',
] as const) {}
