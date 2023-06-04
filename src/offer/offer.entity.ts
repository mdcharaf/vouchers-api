import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'offers' })
export class Offer {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column()
  percentage: number;
}
