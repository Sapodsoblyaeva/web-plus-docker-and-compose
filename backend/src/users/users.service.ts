import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Like, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    return this.userRepository.save(createUserDto);
  }

  async findAll() {
    return this.userRepository.find();
  }

  async findOne(query) {
    return await this.userRepository.findOne({ where: query });
  }

  async findUserForValidation(query) {
    return await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where(query)
      .getOne();
  }

  async findByUserName(username) {
    const user = await this.findOne(username);
    const profileInfo = {
      username: user.username,
      about: user.about,
    };
    return profileInfo;
  }

  async update(token: string, updateUserDto: UpdateUserDto) {
    const data = this.decodeToken(token);
    const email = data.email;

    await this.checkUser(updateUserDto.email, updateUserDto.username, data.id);

    const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
    const updatedUserStatus = await this.userRepository.update(
      { email },
      {
        ...updateUserDto,
        password: hashedPassword,
      },
    );

    return updatedUserStatus;
  }

  async checkUser(email, username, userId) {
    if (email) {
      const userByEmail = await this.findOne({ email });
      if (userByEmail && userByEmail.id !== userId) {
        throw new BadRequestException('Пользователь уже существует');
      }
    }

    if (username) {
      const userByUsername = await this.findOne({ username });
      if (userByUsername && userByUsername.id !== userId) {
        throw new BadRequestException('Пользователь уже существует');
      }
    }
  }

  async remove(id: number, token: string) {
    const user = await this.getUserByToken(token);

    if (user.id !== id) {
      throw new BadRequestException(
        'Вы не можете удалять другиз пользователей',
      );
    }

    return this.userRepository.delete({ id });
  }

  async getUserByToken(fullToken: string) {
    const data = this.decodeToken(fullToken);
    const user = await this.findOne({ email: data.email });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user;
  }

  async findMany(query: string) {
    return await this.userRepository.find({
      where: [{ username: Like(`%${query}%`) }, { email: Like(`%${query}%`) }],
    });
  }

  private decodeToken(fullToken: string) {
    const bearer = fullToken.split(' ')[0];
    const shortToken = fullToken.split(' ')[1];

    if (bearer !== 'Bearer' && !shortToken) {
      throw new Error('There is no token');
    }

    const data = this.jwtService.verify(shortToken);
    return data;
  }

  async getMyWishes(token: string) {
    const user = await this.getUserByToken(token);

    const userWithWishes = await this.userRepository.findOne({
      where: { id: user.id },
      relations: ['wishes'],
    });

    return userWithWishes.wishes;
  }

  async getAnotherUserWishes(username: Record<string, string>) {
    const anotherUser = await this.userRepository.findOne({
      where: username,
      relations: ['wishes'],
    });

    if (!anotherUser) {
      throw new NotFoundException('Пользователь не найден');
    }

    return anotherUser.wishes;
  }
}
