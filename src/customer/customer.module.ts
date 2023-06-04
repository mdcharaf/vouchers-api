import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../database/database.module';
import { Customer } from './customer.entity';
import { CustomerService } from './customer.service';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([Customer])],
  providers: [CustomerService],
  exports: [CustomerService],
})
export class CustomerModule {}
