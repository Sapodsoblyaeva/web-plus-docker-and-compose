import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  username: string;
  password: string;
  about: string;
  email: string;
  avatar: string;
}
