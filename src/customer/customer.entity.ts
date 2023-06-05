import { Voucher } from '../voucher/voucher.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'customers' })
export class Customer {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  email: string;

  @OneToMany(() => Voucher, (v) => v.customer)
  vouchers?: Promise<Voucher[]>;
}
