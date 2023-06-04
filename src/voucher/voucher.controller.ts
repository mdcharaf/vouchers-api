import { Body, Controller, Post } from '@nestjs/common';
import { CreateVoucherDto, VoucherDto } from './voucher.dto';

@Controller('v1/voucher')
export class VoucherController {
  @Post()
  async create(@Body() body: CreateVoucherDto): Promise<VoucherDto> {
    return {
      id: '123',
      customer_id: body.customer_id.toString(),
      offer_id: body.offer_id.toString(),
      expired_at: body.expired_at.toString(),
    };
  }
}
