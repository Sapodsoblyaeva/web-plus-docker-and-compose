import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { Repository } from 'typeorm';
import { WishesService } from 'src/wishes/wishes.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishListRepository: Repository<Wishlist>,
    private readonly wishRepository: WishesService,
    private readonly userRepository: UsersService,
  ) {}

  async create(createWishlistDto: CreateWishlistDto, token) {
    const user = await this.userRepository.getUserByToken(token);

    const wishes = await this.wishRepository.findByIds(
      createWishlistDto.itemsId,
    );

    const wishlist = await this.wishListRepository.create({
      ...createWishlistDto,
      owner: { id: user.id },
      items: wishes,
    });

    return await this.wishListRepository.save(wishlist);
  }

  async findAll() {
    return this.wishListRepository.find({ relations: ['owner', 'items'] });
  }

  async findOne(id) {
    const wishlist = await this.wishListRepository.findOne({
      where: { id },
      relations: ['owner', 'items'],
    });

    if (!wishlist) {
      throw new BadRequestException('Коллекция не найдена');
    }

    return wishlist;
  }

  async update(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
    token: string,
  ) {
    const user = await this.userRepository.getUserByToken(token);

    const wishList = await this.findOne(id);

    if (wishList.owner.id !== user.id) {
      throw new BadRequestException('Вы не можете менять чужие коллекции');
    }

    return await this.wishListRepository.update({ id }, updateWishlistDto);
  }

  async remove(id: number, token: string) {
    const user = await this.userRepository.getUserByToken(token);

    const wishList = await this.findOne(id);

    if (wishList.owner.id !== user.id) {
      throw new BadRequestException('Вы не можете удалять чужие коллекции');
    }

    return await this.wishListRepository.delete({ id });
  }
}
