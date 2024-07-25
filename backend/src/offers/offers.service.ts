import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { Repository, DataSource } from 'typeorm';
// import { WishesService } from 'src/wishes/wishes.service';
import { UsersService } from 'src/users/users.service';
import { WishesService } from 'src/wishes/wishes.service';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offersRepository: Repository<Offer>,
    private readonly userRepository: UsersService,
    // @InjectRepository(Wish)
    @Inject(forwardRef(() => WishesService))
    private readonly wishRepository: WishesService,
    private dataSource: DataSource,
  ) {}

  async create(createOfferDto: CreateOfferDto, token) {
    const user = await this.userRepository.getUserByToken(token);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const wishId = createOfferDto.itemId;

    const wish = await this.wishRepository.findOne(wishId);

    if (!wish) {
      throw new NotFoundException('Подарок не найден');
    }

    const existingOffer = await this.offersRepository.findOne({
      where: { user: { id: user.id }, wish: { id: wishId } },
    });

    if (existingOffer) {
      throw new BadRequestException('Уже сделано предложение');
    }

    if (wish.owner.id === user.id) {
      throw new BadRequestException(
        'Нельзя скидываться на собственный подарок',
      );
    }

    if (parseInt(wish.raised) + parseInt(createOfferDto.amount) > wish.price) {
      throw new BadRequestException('Стоимость подарка превышена');
    }

    const offer = this.offersRepository.create({
      ...createOfferDto,
      user: user,
      wish: wish,
    });

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const savedOffer = await queryRunner.manager.save(offer);

      const something = false;

      if (something) {
        throw new Error('что-то пошло не так');
      }

      const raisedAmount = (
        parseInt(wish.raised) + parseInt(offer.amount)
      ).toString();

      //  await queryRunner.manager.update(Wish, {id: wishId}, {raised: raisedAmount})

      await this.wishRepository.updateRaisedAmount(
        queryRunner,
        wish.id,
        raisedAmount,
      );
      await queryRunner.commitTransaction();
      return savedOffer;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(
        `В процессе операции возникла ошибка ${err.message}`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    return await this.offersRepository.find({});
  }

  async findOne(id: number) {
    return await this.offersRepository.findOne({ where: { id } });
  }

  async remove(id: number) {
    return await this.offersRepository.delete({ id });
  }
}
