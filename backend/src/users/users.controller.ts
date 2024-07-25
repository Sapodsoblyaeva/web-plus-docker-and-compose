import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { OwnAuthGuard } from 'src/guards/own-auth.guard';

@Controller('users')
@UseGuards(OwnAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('me')
  getOwnUser(@Headers('authorization') authHeader: string) {
    return this.usersService.getUserByToken(authHeader);
  }

  @Get(':username')
  findOne(@Param() username: string) {
    return this.usersService.findByUserName(username);
  }

  @Post('find')
  async findMany(@Body('query') query: string) {
    if (!query) {
      throw new Error('Что-то пошло не так... ');
    }
    return this.usersService.findMany(query);
  }

  @Patch('me')
  update(
    @Headers('authorization') authHeader: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(authHeader, updateUserDto);
  }

  @Delete(':id')
  remove(
    @Param('id') id: number,
    @Headers('authorization') authHeader: string,
  ) {
    return this.usersService.remove(id, authHeader);
  }

  @Get('me/wishes')
  getMyWishes(@Headers('authorization') authHeader: string) {
    return this.usersService.getMyWishes(authHeader);
  }

  @Get(':username/wishes')
  getAnotherUserWishes(@Param() username: Record<string, string>) {
    console.log(username);
    return this.usersService.getAnotherUserWishes(username);
  }
}
