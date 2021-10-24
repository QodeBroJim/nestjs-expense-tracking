import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Payment } from './payment.entity';

@Entity('expenses')
export class Expense {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  expense_name: string;

  @Column()
  initial_loan_amount: number;

  @Column()
  current_loan_balance: number;

  @Column()
  due_date: number;

  @Column()
  expense_type: string;

  @ManyToMany((type) => Payment, (payment) => payment.expense, {
    cascade: true,
  })
  @JoinTable({
    name: 'expense_payments',
    joinColumn: { name: 'payment_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'expense_id', referencedColumnName: 'id' },
  })
  payment: Payment[];
}
