import { IsEmail, IsString, Length } from 'class-validator';
import { Post } from 'src/post/post.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsEmail()
  email: string;

  @Column({ unique: true })
  @IsString()
  name: string;

  @Column()
  @Length(4)
  password: string;

  @OneToMany(() => Post, (post) => post.author)
  @JoinColumn({ referencedColumnName: 'posts' })
  posts: Post[];
}

export default User;
