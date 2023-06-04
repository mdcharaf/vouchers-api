import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './offer.entity';

@Injectable()
export class OfferService {
  constructor(
    @InjectRepository(Offer)
    private readonly repo: Repository<Offer>,
  ) {}

  async findOffer(id: number): Promise<Offer> {
    const offer = this.repo.findOneBy({ id });
    if (!offer) {
      throw new NotFoundException(`offer ${id} not found`);
    }

    return offer;
  }
}
