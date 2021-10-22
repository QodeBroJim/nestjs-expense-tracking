import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

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
      autoLoadEntities: true,
      synchronize: true, // set to false in production
      extra: {
        trustServerCertificate: true, // set to true for development
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
