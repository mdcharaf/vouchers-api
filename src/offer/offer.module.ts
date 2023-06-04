import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../database/database.module';
import { Offer } from './offer.entity';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([Offer])],
})
export class OfferModule {}
