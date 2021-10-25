import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Expense } from './expenses/entities/expense.entity';
import { ExpensesModule } from './expenses/expenses.module';
import { Payment } from './expenses/entities/payment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT, // the plus sign converts the string into a number (by default all values contained in a .env file are stored as string)
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [Expense, Payment, User],
      synchronize: true, // set to false in production
      migrations: [process.env.MIGRATIONS],
      cli: {
        migrationsDir: process.env.MIGRATIONS_DIR,
      },
      extra: {
        trustServerCertificate: true, // set to true for development
      },
    }),
    ExpensesModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
