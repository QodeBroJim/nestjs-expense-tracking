import { IsNumber, IsString } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  payment_date: number;

  @IsNumber()
  alternate_payment_date: number;

  @IsNumber()
  payment_amount: number;

  @IsNumber()
  actual_payment_amount: number;

  @IsString({ each: true })
  expense: string[];
}
