import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { WishesModule } from './wishes/wishes.module';
import { WishlistsModule } from './wishlists/wishlists.module';
import { OffersModule } from './offers/offers.module';
import { User } from './users/entities/user.entity';
import { Offer } from './offers/entities/offer.entity';
import { Wish } from './wishes/entities/wish.entity';
import { Wishlist } from './wishlists/entities/wishlist.entity';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

const {
  POSTGRES_HOST,
  POSTGRES_DB,
  POSTGRES_PORT,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
} = process.env;

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: POSTGRES_HOST|| 'localhost',
      port: parseInt(POSTGRES_PORT) || 5432,
      username: POSTGRES_USER|| 'student',
      password: POSTGRES_PASSWORD || 'student',
      database: POSTGRES_DB || 'nest',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    WishesModule,
    WishlistsModule,
    OffersModule,
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Wish]),
    TypeOrmModule.forFeature([Offer]),
    TypeOrmModule.forFeature([Wishlist]),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
