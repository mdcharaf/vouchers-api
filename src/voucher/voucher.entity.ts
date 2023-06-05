import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'customer_vouchers' })
export class Voucher {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column({ name: 'customer_id' })
  customerId: number;

  @Column({ name: 'offer_id' })
  offerId: number;

  @Column({ name: 'expires_at' })
  expiresAt: Date;

  @Column({ name: 'used_at' })
  usedAt?: Date;
}
