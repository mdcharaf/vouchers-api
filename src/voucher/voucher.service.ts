import { Injectable } from '@nestjs/common';
import { Voucher } from './voucher.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerService } from '../customer/customer.service';
import { OfferService } from '../offer/offer.service';

@Injectable()
export class VoucherService {
  constructor(
    @InjectRepository(Voucher)
    private readonly voucherRepo: Repository<Voucher>,
    private readonly customerService: CustomerService,
    private readonly offerService: OfferService,
  ) {}

  async createVoucher(voucher: Partial<Voucher>): Promise<Voucher> {
    const result = await this.voucherRepo.save(voucher);
    return result;
  }
}
