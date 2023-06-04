import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfig } from './typeorm.config';

@Module({
  imports: [TypeOrmModule.forRoot(dbConfig)],
})
export class DatabaseModule {}
