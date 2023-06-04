import { Body, Controller, Param, Post } from '@nestjs/common';
import { CreateVoucherDto, VoucherDto } from './voucher.dto';
import { VoucherService } from './voucher.service';

@Controller('v1/voucher')
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) {}

  @Post()
  async create(@Body() body: CreateVoucherDto): Promise<VoucherDto> {
    const voucher = await this.voucherService.createVoucher({
      expiresAt: new Date(body.expired_at),
      customerId: body.customer_id,
      offerId: body.offer_id,
    });

    return {
      id: voucher.id,
      customer_id: voucher.offerId.toString(),
      offer_id: voucher.offerId.toString(),
      expired_at: voucher.expiresAt.toString(),
    };
  }

  @Post(':id/redeem')
  async redeem(@Param('id') id: string): Promise<VoucherDto> {
    const voucher = await this.voucherService.redeemVoucher(id);

    return {
      id: voucher.id,
      customer_id: voucher.offerId.toString(),
      offer_id: voucher.offerId.toString(),
      expired_at: voucher.expiresAt.toString(),
      is_used: voucher.usedAt ? true : false,
    };
  }
}
