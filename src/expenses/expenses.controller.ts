import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Expense } from './entities/expense.entity';
import { ExpensesService } from './expenses.service';

@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expenseService: ExpensesService) {}

  // Create expense
  @Post()
  async createExpense(
    @Body() createExpense: CreateExpenseDto,
  ): Promise<Expense> {
    return await this.expenseService.createExpense(createExpense);
  }

  // Get specific expense
  @Get(':id')
  async getExpense(@Param('id') id: number): Promise<Expense> {
    return await this.expenseService.getExpense(id);
  }

  // Get all expenses
  @Get()
  async getAllExpenses(): Promise<Expense[]> {
    return await this.expenseService.getAllExpenses();
  }

  // Delete an expense by ID
  @Delete(':id')
  async deleteExpense(@Param('id') id: number): Promise<string> {
    return this.expenseService.deleteExpense(id);
  }

  // Update expense by ID
  @Patch(':id')
  async updateExpense(
    @Param('id') id: number,
    @Body() updateExpenseDto: UpdateExpenseDto,
  ): Promise<Expense> {
    return await this.expenseService.updateExpense(id, updateExpenseDto);
  }
}
