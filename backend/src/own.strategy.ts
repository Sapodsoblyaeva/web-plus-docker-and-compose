import { AuthService } from './auth/auth.service';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UnauthorizedException } from '@nestjs/common';

interface JwtData {
  username: string;
  password: string;
}

export class OwnStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'super-secret',
    });
  }

  async validate(payload: JwtData) {
    const user = await this.authService.validateUser({
      username: payload.username,
      password: payload.password,
    });

    if (!user) {
      throw new UnauthorizedException('Требуется авторизация');
    }

    return user;
  }
}
