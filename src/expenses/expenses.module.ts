import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expense } from './entities/expense.entity';
import { Payment } from './entities/payment.entity';
import { ExpensesController } from './expenses.controller';
import { ExpensesService } from './expenses.service';
import { PaymentsService } from './payments/payments.service';
import { PaymentsController } from './payments/payments.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Expense, Payment])],
  controllers: [ExpensesController, PaymentsController],
  providers: [ExpensesService, PaymentsService],
})
export class ExpensesModule {}
