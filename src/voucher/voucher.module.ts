import { Module } from '@nestjs/common';
import { VoucherController } from './voucher.controller';
import { VoucherService } from './voucher.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Voucher } from './voucher.entity';
import { DatabaseModule } from '../database/database.module';
import { Customer } from '../customer/customer.entity';
import { Offer } from '../offer/offer.entity';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([Voucher, Customer, Offer]),
  ],
  controllers: [VoucherController],
  providers: [VoucherService],
})
export class VoucherModule {}
