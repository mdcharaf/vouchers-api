import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { RedeemVoucherDto, VoucherDto } from './voucher.dto';
import { VoucherService } from './voucher.service';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('v1/voucher')
@UseGuards(ThrottlerGuard)
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) {}

  @Post('/redeem')
  async redeem(@Body() body: RedeemVoucherDto): Promise<VoucherDto> {
    const voucher = await this.voucherService.redeemVoucher(
      body.code,
      body.customer_email,
    );

    return {
      id: voucher.id,
      code: voucher.code,
      discount: voucher.offer.percentage,
      is_used: voucher.usedAt ? true : false,
      offer_id: voucher.offerId.toString(),
      customer_id: voucher.offerId.toString(),
    };
  }
}
