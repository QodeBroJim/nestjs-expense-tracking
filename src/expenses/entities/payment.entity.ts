import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Expense } from './expense.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  created_date: Date;

  @Column()
  name: string;

  @Column({ default: 0 })
  payment_date: number;

  @Column({ default: 0 })
  alternate_payment_date: number;

  @Column({ default: 0 })
  payment_amount: number;

  @Column({ default: 0 })
  actual_payment_amount: number;

  @ManyToMany((type) => Expense, (expense) => expense.payment)
  expense: Expense[];
}
