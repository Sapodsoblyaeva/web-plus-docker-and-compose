import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';
import { In, QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { OffersService } from 'src/offers/offers.service';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
    private readonly userService: UsersService,
    private readonly offersRepository: OffersService,
  ) {}

  async create(createWishDto: CreateWishDto, token: string) {
    const user = await this.userService.getUserByToken(token);

    const wish = this.wishRepository.create({
      ...createWishDto,
      owner: user,
    });

    return this.wishRepository.save(wish);
  }

  async findAll() {
    return await this.wishRepository.find({ relations: ['owner'] });
  }

  async findOne(id) {
    return await this.wishRepository.findOne({
      where: { id },
      relations: ['owner', 'originalWish'],
    });
  }

  async findLastWishes() {
    const wishes = await this.getWishes({ createdAt: 'DESC' }, 40);
    return wishes;
  }

  async findTopWishes() {
    const wishes = await this.getWishes({ copied: 'DESC' }, 20);
    return wishes;
  }

  async update(id: number, updateWishDto: UpdateWishDto, token: string) {
    const checkWish = this.checkWhoseWish(token, id);

    if (!checkWish) {
      throw new BadRequestException('Вы не можете изменять чужие подарки');
    }

    return await this.wishRepository.update({ id }, updateWishDto);
  }

  async remove(id: number, token: string) {
    const checkWish = this.checkWhoseWish(token, id);

    if (!checkWish) {
      throw new BadRequestException('Вы не можете удалять чужие подарки');
    }

    return await this.wishRepository.delete({ id });
  }

  async checkWhoseWish(token: string, wishId: number) {
    const user = await this.userService.getUserByToken(token);
    const wish = await this.findOne(wishId);

    const wishOwner = wish.owner;
    if (wishOwner.id !== user.id) {
      return false;
    }
    return true;
  }

  async getWishes(sortedBy, take) {
    return await this.wishRepository.find({
      order: sortedBy,
      take: take,
    });
  }

  async copyWish(id, token) {
    const copiedWish = await this.findOne(id);
    const user = await this.userService.getUserByToken(token);

    const originalWish = copiedWish.originalWish || copiedWish;

    const { id: _, ...wishData } = copiedWish;

    const checkIfIAlreadyHaveThisWish = await this.wishRepository.find({
      where: { name: copiedWish.name, owner: { id: user.id } },
      relations: ['owner'],
    });

    if (checkIfIAlreadyHaveThisWish.length > 1) {
      throw new BadRequestException('У меня уже есть это желание');
    }

    const newWish = await this.wishRepository.create({
      ...wishData,
      copied: 0,
      owner: user,
      originalWish: originalWish,
      raised: '0',
    });

    originalWish.copied += 1;
    await this.wishRepository.save(originalWish);
    return await this.wishRepository.save(newWish);
  }

  async findByIds(ids: number[]) {
    return await this.wishRepository.findBy({ id: In(ids) });
  }

  async updateRaisedAmount(
    queryRunner: QueryRunner,
    wishId: number,
    raisedAmount: string,
  ) {
    const wish = await queryRunner.manager.findOne(Wish, {
      where: { id: wishId },
    });

    if (!wish) {
      throw new NotFoundException('Подарок не найден');
    }

    return await queryRunner.manager.update(Wish, wishId, {
      raised: raisedAmount,
    });
  }
}
