import { IsEmail, IsNotEmpty, Max, Min } from 'class-validator';
import { Offer } from 'src/offers/entities/offer.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @IsNotEmpty({ message: 'Имя пользователя не может быть пустым' })
  @Min(2)
  @Max(30)
  @Column({ unique: true })
  username: string;

  @Min(2)
  @Max(200)
  @Column({ default: 'Пока ничего не рассказал о себе' })
  about: string;

  @Column({ default: 'https://i.pravatar.cc/300' })
  avatar: string;

  @IsEmail({}, { message: 'Email должен быть валидным' })
  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: string[];

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: string[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: string[];
}
