import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { OwnAuthGuard } from 'src/guards/own-auth.guard';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  @UseGuards(OwnAuthGuard)
  create(
    @Body() createWishDto: CreateWishDto,
    @Headers('authorization') authHeader: string,
  ) {
    return this.wishesService.create(createWishDto, authHeader);
  }

  @Get()
  @UseGuards(OwnAuthGuard)
  findAll() {
    return this.wishesService.findAll();
  }

  @Get('last')
  findLastWish() {
    return this.wishesService.findLastWishes();
  }

  @Get('top')
  findTopWish() {
    return this.wishesService.findTopWishes();
  }

  @Get(':id')
  @UseGuards(OwnAuthGuard)
  findWishById(@Param('id') id: number) {
    return this.wishesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(OwnAuthGuard)
  update(
    @Param('id') id: number,
    @Body() updateWishDto: UpdateWishDto,
    @Headers('authorization') authHeader: string,
  ) {
    return this.wishesService.update(id, updateWishDto, authHeader);
  }

  @Delete(':id')
  @UseGuards(OwnAuthGuard)
  remove(
    @Param('id') id: number,
    @Headers('authorization') authHeader: string,
  ) {
    return this.wishesService.remove(id, authHeader);
  }

  @Post(':id/copy')
  @UseGuards(OwnAuthGuard)
  copyWish(
    @Param('id') id: number,
    @Headers('authorization') authHeader: string,
  ) {
    return this.wishesService.copyWish(id, authHeader);
  }
}
