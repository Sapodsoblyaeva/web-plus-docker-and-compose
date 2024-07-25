import { IsUrl, Max, Min } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Wishlist {
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

  @Max(1500)
  @Column({ nullable: true })
  description: string;

  @IsUrl({}, { message: 'Invalid URL format' })
  @Column()
  image: string;

  @OneToMany(() => Wish, (wish) => wish.wishlist)
  items: Wish[];

  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;
}
