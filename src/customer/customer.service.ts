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

  async findCustomer(critieria: Partial<Customer>): Promise<Customer> {
    const customer = this.repo.findOneBy(critieria);
    if (!customer) {
      throw new NotFoundException(`customer not found`);
    }

    return customer;
  }
}
