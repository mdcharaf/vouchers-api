import { IsDate, IsInt, IsNotEmpty } from 'class-validator';

export class CreateVoucherDto {
  @IsNotEmpty()
  @IsInt()
  customer_id: number;

  @IsNotEmpty()
  @IsInt()
  offer_id: number;

  @IsNotEmpty()
  @IsDate()
  expired_at: Date;
}

export interface VoucherDto {
  id: number;
  code: string;
  customer_id: string;
  offer_id: string;
  expired_at: string;
  is_used?: boolean;
}
