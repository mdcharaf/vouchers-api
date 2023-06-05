import { Injectable, NotFoundException } from '@nestjs/common';
import { Customer } from './customer.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly repo: Repository<Customer>,
  ) {}

  async findCustomer(critieria: object): Promise<Customer> {
    const customer = await this.repo.findOneBy(critieria);

    if (!customer) {
      throw new NotFoundException(`customer not found`);
    }

    return customer;
  }

  async listCustomerVouchers(email: string): Promise<Customer> {
    const customer = await this.repo
      .createQueryBuilder('customer')
      .innerJoinAndSelect('customer.vouchers', 'voucher')
      .innerJoinAndSelect('voucher.offer', 'offer')
      .where('customer.email = :email', { email })
      .getOne();

    if (!customer) {
      throw new NotFoundException(`customer not found`);
    }

    return customer;
  }
}
