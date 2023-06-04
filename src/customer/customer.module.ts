import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../database/database.module';
import { Customer } from './customer.entity';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([Customer])],
})
export class CustomerModule {}
