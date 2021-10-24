import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Expense } from './entities/expense.entity';
import { Payment } from './entities/payment.entity';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepo: Repository<Expense>,
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
  ) {}

  // create a product
  async createExpense(createExpense: CreateExpenseDto): Promise<Expense> {
    const payment = await Promise.all(
      createExpense.payment.map((payment) => this.preloadPayments(payment)),
    );

    const expense = this.expenseRepo.create({
      ...createExpense,
      payment,
    });

    return await this.expenseRepo.save(expense);
  }

  // get expense by id
  async getExpense(id: number): Promise<Expense> {
    const expense = await this.expenseRepo.findOne(id, {
      relations: ['payment'],
    });

    if (!expense) {
      throw new NotFoundException(`Unable to find a product using ID #${id}.`);
    }

    return expense;
  }

  // get all expenses
  async getAllExpenses(): Promise<Expense[]> {
    return await this.expenseRepo.find({ relations: ['payment'] });
  }

  // update a specific expense
  async updateExpense(
    id: number,
    updateExpenseDto: UpdateExpenseDto,
  ): Promise<Expense> {
    const payment =
      updateExpenseDto &&
      (await Promise.all(
        updateExpenseDto.payment.map((payment) =>
          this.preloadPayments(payment),
        ),
      ));
    const existingExpense = await this.expenseRepo.preload({
      id: +id,
      ...updateExpenseDto,
      payment,
    });

    if (!existingExpense) {
      throw new NotFoundException(
        `No expense exists with id #${id}. Please try again.`,
      );
    }

    return this.expenseRepo.save(existingExpense);
  }

  // delete specific expense
  async deleteExpense(id: number): Promise<string> {
    const expense = this.expenseRepo.findOne(id);

    if (!expense) {
      throw new NotFoundException(
        `There is no expense with ID #{$id} in the system.`,
      );
    }

    await this.expenseRepo.delete(id);

    return 'Expense has been deleted successfully.';
  }

  // load related payments
  private async preloadPayments(payment_name: string): Promise<Payment> {
    const existingPayment = await this.paymentRepo.findOne({
      where: { name: payment_name },
    });
    if (existingPayment) {
      return existingPayment;
    }
    return this.paymentRepo.create({ name: payment_name });
  }
}
