import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'vouchers' })
export class Voucher {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'customer_id' })
  customerId: number;

  @Column({ name: 'offer_id' })
  offerId: number;

  @Column({ name: 'expires_at' })
  expiresAt: Date;

  @Column({ name: 'used_at' })
  usedAt?: Date;
}
