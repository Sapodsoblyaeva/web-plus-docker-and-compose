import { Module, forwardRef } from '@nestjs/common';
import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { UsersModule } from 'src/users/users.module';
import { WishesModule } from 'src/wishes/wishes.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [OffersController],
  providers: [OffersService],
  imports: [
    TypeOrmModule.forFeature([Offer]),
    UsersModule,
    forwardRef(() => WishesModule),
    AuthModule,
  ],
  exports: [OffersService],
})
export class OffersModule {}
