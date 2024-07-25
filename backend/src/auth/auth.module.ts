import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { OwnStrategy } from 'src/own.strategy';
import { OwnAuthGuard } from 'src/guards/own-auth.guard';

@Module({
  controllers: [AuthController],
  providers: [AuthService, OwnStrategy, OwnAuthGuard],
  imports: [
    forwardRef(() => UsersModule),
    PassportModule,
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'super-secret',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
