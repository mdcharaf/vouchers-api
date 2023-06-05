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

  async redeemVoucher(code: string, email: string): Promise<Voucher> {
    const customer = await this.customerService.findCustomer({ email });

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const voucher = await queryRunner.manager
        .createQueryBuilder(Voucher, 'voucher')
        .useTransaction(true)
        .setLock('pessimistic_write')
        .where('code = :code AND customer_id = :customerId', {
          code,
          customerId: customer.id,
        })
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

      await queryRunner.manager.update(
        Voucher,
        { id: voucher.id },
        { usedAt: now },
      );
      await queryRunner.commitTransaction();

      return await this.voucherRepo.findOne({
        where: { id: voucher.id },
        relations: { offer: true },
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
