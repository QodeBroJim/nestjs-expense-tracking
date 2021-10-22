import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expense } from './expenses/entities/expense.entity';
import { ExpensesModule } from './expenses/expenses.module';

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
      entities: [Expense],
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
