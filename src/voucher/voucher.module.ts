import { Module } from '@nestjs/common';
import { VoucherController } from './voucher.controller';
import { VoucherService } from './voucher.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Voucher } from './voucher.entity';
import { DatabaseModule } from '../database/database.module';
import { Customer } from '../customer/customer.entity';
import { Offer } from '../offer/offer.entity';
import { CustomerModule } from '../customer/customer.module';
import { OfferModule } from '../offer/offer.module';
import { CustomerService } from '../customer/customer.service';
import { OfferService } from '../offer/offer.service';

@Module({
  imports: [
    DatabaseModule,
    CustomerModule,
    OfferModule,
    TypeOrmModule.forFeature([Voucher, Customer, Offer]),
  ],
  controllers: [VoucherController],
  providers: [VoucherService, CustomerService, OfferService],
})
export class VoucherModule {}
