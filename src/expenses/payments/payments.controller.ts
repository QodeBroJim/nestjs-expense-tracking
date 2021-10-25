import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { UpdatePaymentDto } from '../dto/update-payment.dto';
import { Payment } from '../entities/payment.entity';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  // inject dependency using constructor
  constructor(private readonly paymentServ: PaymentsService) {}

  // Create payment
  @Post()
  async createPayment(
    @Body() createPayment: CreatePaymentDto,
  ): Promise<Payment> {
    return await this.paymentServ.createPayment(createPayment);
  }

  // Get single payment by id
  @Get(':id')
  async getPayment(@Param('id') id: number): Promise<Payment> {
    return await this.paymentServ.getPayment(id);
  }

  // Get all payments
  @Get()
  async getAllPayments(): Promise<Payment[]> {
    return await this.paymentServ.getAllPayments();
  }

  // Delete single payment by id
  @Delete(':id')
  async deletePayment(@Param('id') id: number): Promise<string> {
    return await this.paymentServ.deletePayment(id);
  }

  // Update single payment by id
  @Patch(':id')
  async updatePayment(
    @Param('id') id: number,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ): Promise<Payment> {
    return await this.paymentServ.updatePayment(id, updatePaymentDto);
  }
}
