import { IsUrl, Max, Min } from 'class-validator';
import { Offer } from 'src/offers/entities/offer.entity';
import { User } from 'src/users/entities/user.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Wish {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Min(1)
  @Max(250)
  @Column()
  name: string;

  @Column()
  link: string;

  @IsUrl({}, { message: 'Invalid URL format' })
  @Column()
  image: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'real', default: '0' })
  raised: string;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @ManyToOne(() => Wishlist, (wishlist) => wishlist.items, {
    onDelete: 'SET NULL',
  })
  wishlist: Wishlist;

  @Min(1)
  @Max(1024)
  @Column()
  description: string;

  @OneToOne(() => Offer, (offer) => offer.wish)
  @Column('int', { default: 0 })
  copied: number;

  @ManyToOne(() => Wish)
  originalWish: Wish;
}
