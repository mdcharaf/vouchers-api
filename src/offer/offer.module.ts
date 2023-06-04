import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../database/database.module';
import { Offer } from './offer.entity';
import { OfferService } from './offer.service';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([Offer])],
  providers: [OfferService],
  exports: [OfferService],
})
export class OfferModule {}
