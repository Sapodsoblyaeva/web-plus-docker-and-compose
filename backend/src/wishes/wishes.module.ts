import { Module, forwardRef } from '@nestjs/common';
import { WishesService } from './wishes.service';
import { WishesController } from './wishes.controller';
import { Wish } from './entities/wish.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { OffersModule } from 'src/offers/offers.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [WishesController],
  providers: [WishesService],
  imports: [
    TypeOrmModule.forFeature([Wish]),
    UsersModule,
    forwardRef(() => OffersModule),
    AuthModule,
  ],
  exports: [WishesService],
})
export class WishesModule {}
