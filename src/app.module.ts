import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { VoucherModule } from './voucher/voucher.module';
import { CustomerModule } from './customer/customer.module';
import { OfferModule } from './offer/offer.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot({
      ttl: 60, // TODO: refactor it to use environment variables
      limit: 60,
    }),
    DatabaseModule,
    VoucherModule,
    CustomerModule,
    OfferModule,
  ],
})
export class AppModule {}
