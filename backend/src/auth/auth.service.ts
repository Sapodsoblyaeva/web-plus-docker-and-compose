import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(createUserDto: CreateUserDto) {
    const user = await this.validateUser(createUserDto);
    return this.generateToken(user);
  }

  async register(createUserDto: CreateUserDto) {
    const user = await this.userService.findOne({ email: createUserDto.email });

    if (user) {
      throw new BadRequestException('Пользователь уже существует');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const newUser = await this.userService.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.generateToken(newUser);
  }

  async generateToken(user: User) {
    const payload = { email: user.email, id: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUser({ username, password }) {
    const user = await this.userService.findUserForValidation({ username: username });

    const passwordCheck = await bcrypt.compare(password, user.password);
    if (user && passwordCheck) {
      return user;
    }
    throw new UnauthorizedException('Некорректные логин или пароль');
  }

  async validateUserById(id: number) {
    const user = await this.userService.findOne({ id });
    if (user) {
      return user;
    }
    throw new UnauthorizedException('Пользователь не найден');
  }
}
