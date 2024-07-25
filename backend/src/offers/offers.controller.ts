import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { OwnAuthGuard } from 'src/guards/own-auth.guard';

@Controller('offers')
@UseGuards(OwnAuthGuard)
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  create(
    @Body() createOfferDto: CreateOfferDto,
    @Headers('authorization') authHeader: string,
  ) {
    return this.offersService.create(createOfferDto, authHeader);
  }

  @Get()
  findAll() {
    return this.offersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.offersService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.offersService.remove(id);
  }
}
