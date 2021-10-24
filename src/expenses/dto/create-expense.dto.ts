import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateExpenseDto {
  @IsString()
  expense_name: string;

  @IsNumber()
  initial_loan_amount: number;

  @IsNumber()
  current_loan_balance: number;

  @IsNumber()
  due_date: number;

  @IsString()
  expense_type: string;

  @IsString({ each: true })
  @IsOptional()
  payment: string[];
}
