import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('expenses')
export class Expense {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  due_amount: number;

  @Column()
  actual_payment_amount: number;

  @Column()
  expense_type: string;

  @Column()
  payment_date: Date;

  @Column()
  due_date: Date;

  @Column()
  balance: number;
}
