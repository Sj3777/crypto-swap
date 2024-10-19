import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PricesModule } from './prices/prices.module';
import { AlertsModule } from './alerts/alerts.module';
import { SwapModule } from './swap/swap.module';
import { EmailModule } from './email/email.module';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './tasks/tasks.service';
import { AlertsService } from './alerts/alerts.service';
import { TasksModule } from './tasks/tasks.module';
import { AlertsController } from './alerts/alerts.controller';
import { Alert } from './alerts/alert.entity';
import { DatabaseModule } from './database.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // To use environment variables globally
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT) || 5432,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      // entities: [__dirname + '/**/*.entity{.ts,.js}'],
      // entities: [Alert,],
      autoLoadEntities: true,
      synchronize: false, // Use migrations in production
      logging: true
    }),
    PricesModule,
    AlertsModule,
    SwapModule,
    EmailModule,
    TasksModule,
    DatabaseModule,
  ],
  controllers: [AlertsController],
  providers: [TasksService, AlertsService],
})
export class AppModule {}
