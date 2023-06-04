import { Injectable } from '@nestjs/common';
import { Voucher } from './voucher.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class VoucherService {
  constructor(
    @InjectRepository(Voucher)
    private readonly voucherRepo: Repository<Voucher>,
  ) {}

  async createVoucher(voucher: Partial<Voucher>): Promise<Voucher> {
    const result = await this.voucherRepo.save(voucher);
    return result;
  }
}
