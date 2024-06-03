import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { AuthGuard } from 'src/auth/authGuard';
import { InputUserDto } from './dtos/input-user.dto';
import { UserDto } from './dtos/user.dto';
import { UserService } from './user.service';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ description: 'Получение всех пользователей' })
  @Get()
  async getAll() {
    const users = await this.userService.getAll();
    return plainToInstance(UserDto, users);
  }

  @ApiOperation({ description: 'Получение одного пользователя' })
  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.getOne(id);
    return plainToInstance(UserDto, user);
  }

  @ApiOperation({ description: 'Обновление пользователя' })
  @UseGuards(AuthGuard)
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: InputUserDto,
  ) {
    const updatedUser = await this.userService.update(id, dto);
    return plainToInstance(UserDto, updatedUser);
  }

  @ApiOperation({ description: 'Удаление пользователя' })
  @UseGuards(AuthGuard)
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.userService.delete(id);
  }
}
