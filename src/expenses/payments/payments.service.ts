import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { UpdatePaymentDto } from '../dto/update-payment.dto';
import { Expense } from '../entities/expense.entity';
import { Payment } from '../entities/payment.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(Expense)
    private readonly expenseRepo: Repository<Expense>,
  ) {}

  // create a payment
  async createPayment(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const expense = await Promise.all(
      createPaymentDto.expense.map((expense) => this.preloadExpenses(expense)),
    );

    const payment = this.paymentRepo.create({
      ...createPaymentDto,
      expense,
    });

    return await this.paymentRepo.save(payment);
  }

  // get single payment
  async getPayment(id: number): Promise<Payment> {
    const payment = await this.paymentRepo.findOne(id, {
      relations: ['expense'],
    });

    if (!payment) {
      throw new NotFoundException(
        `No payment found with id #${id}. Please try again.`,
      );
    }

    return payment;
  }

  // get all payments
  async getAllPayments(): Promise<Payment[]> {
    return await this.paymentRepo.find({ relations: ['expense'] });
  }

  // delete a single payment
  async deletePayment(id: number): Promise<string> {
    const payment = await this.paymentRepo.findOne(id);

    if (!payment) {
      throw new NotFoundException(
        `No payment with ID #${id} exists. Please try again.`,
      );
    }

    await this.paymentRepo.remove(payment);
    return 'Successfully removed payment.';
  }

  // update a single payment
  async updatePayment(id: number, updatePaymentDto: UpdatePaymentDto) {
    const expense =
      updatePaymentDto &&
      (await Promise.all(
        updatePaymentDto.expense.map((name) => this.preloadExpenses(name)),
      ));
    const existingPayment = await this.paymentRepo.preload({
      id: +id,
      ...updatePaymentDto,
      expense,
    });
    if (!existingPayment) {
      throw new NotFoundException(`Payment with id #${id} was not found.`);
    }
    return this.paymentRepo.save(existingPayment);
  }

  // preload related expenses
  private async preloadExpenses(expense_name: string): Promise<Expense> {
    const existingExpense = await this.expenseRepo.findOne({ expense_name });

    if (existingExpense) {
      return existingExpense;
    }

    return this.expenseRepo.create({ expense_name });
  }
}
