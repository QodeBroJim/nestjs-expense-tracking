import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expense } from './entities/expense.entity';
import { Payment } from './entities/payment.entity';
import { ExpensesController } from './expenses.controller';
import { ExpensesService } from './expenses.service';

@Module({
  imports: [TypeOrmModule.forFeature([Expense, Payment])],
  controllers: [ExpensesController],
  providers: [ExpensesService],
})
export class ExpensesModule {}
