import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('v1/customer')
@UseGuards(ThrottlerGuard)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get('/vouchers')
  async fineOne(@Query('email') email: string): Promise<any> {
    const result = await this.customerService.listCustomerVouchers(email);
    return (await result.vouchers).map((v) => ({
      code: v.id,
      offer_name: v.offer.name,
      offer_discount: v.offer.percentage,
    }));
  }
}
