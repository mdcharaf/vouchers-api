import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Voucher } from './voucher.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerService } from '../customer/customer.service';
import { OfferService } from '../offer/offer.service';

@Injectable()
export class VoucherService {
  constructor(
    @InjectRepository(Voucher)
    private readonly voucherRepo: Repository<Voucher>,
    private readonly dataSource: DataSource,
    private readonly customerService: CustomerService,
    private readonly offerService: OfferService,
  ) {}

  async createVoucher(voucher: Partial<Voucher>): Promise<Voucher> {
    if (voucher.expiresAt <= new Date()) {
      throw new BadRequestException('Invalid voucher expiration date');
    }

    const customer = await this.customerService.findCustomer(
      voucher.customerId,
    );
    const offer = await this.offerService.findOffer(voucher.offerId);

    const result = await this.voucherRepo.save({
      customerId: customer.id,
      offerId: offer.id,
      expiresAt: voucher.expiresAt,
    });

    return result;
  }

  async redeemVoucher(id: string): Promise<Voucher> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const voucher = await queryRunner.manager
        .createQueryBuilder(Voucher, 'voucher')
        .useTransaction(true)
        .setLock('pessimistic_write')
        .where('id = :id', { id })
        .getOne();

      if (!voucher) {
        throw new NotFoundException('voucher not found');
      }

      const now = new Date();
      if (now > voucher.expiresAt) {
        throw new BadRequestException('Voucher expired');
      }

      if (voucher.usedAt) {
        throw new BadRequestException('Voucher has already been redeemed');
      }

      const res = await queryRunner.manager.save(Voucher, {
        ...voucher,
        usedAt: now,
      });

      await queryRunner.commitTransaction();
      return res;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
