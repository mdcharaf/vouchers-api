import { Customer } from 'src/customer/customer.entity';
import { Offer } from '../offer/offer.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'customer_vouchers' })
export class Voucher {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column({ name: 'customer_id' })
  customerId: number;

  @ManyToOne(() => Customer, (c) => c.vouchers, { eager: true })
  @JoinColumn({ name: 'customer_id' })
  customer?: Customer;

  @Column({ name: 'offer_id' })
  offerId: number;

  @ManyToOne(() => Offer, (of) => of.vouchers, { eager: true })
  @JoinColumn({ name: 'offer_id' })
  offer?: Offer;

  @Column({ name: 'expires_at' })
  expiresAt: Date;

  @Column({ name: 'used_at' })
  usedAt?: Date;
}
