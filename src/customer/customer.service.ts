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

  async findCustomer(id: number): Promise<Customer> {
    const customer = this.repo.findOneBy({ id });
    if (!customer) {
      throw new NotFoundException(`customer ${id} not found`);
    }

    return customer;
  }
}
