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
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { OwnAuthGuard } from 'src/guards/own-auth.guard';

@Controller('wishlistlists')
@UseGuards(OwnAuthGuard)
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  create(
    @Body() createWishlistDto: CreateWishlistDto,
    @Headers('authorization') authHeader: string,
  ) {
    return this.wishlistsService.create(createWishlistDto, authHeader);
  }

  @Get()
  findAll() {
    return this.wishlistsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.wishlistsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
    @Headers('authorization') authHeader: string,
  ) {
    return this.wishlistsService.update(id, updateWishlistDto, authHeader);
  }

  @Delete(':id')
  remove(
    @Param('id') id: number,
    @Headers('authorization') authHeader: string,
  ) {
    return this.wishlistsService.remove(id, authHeader);
  }
}
