import { Voucher } from '../voucher/voucher.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'offers' })
export class Offer {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column()
  percentage: number;

  @OneToMany(() => Voucher, (v) => v.offer)
  vouchers?: Promise<Voucher[]>;
}
