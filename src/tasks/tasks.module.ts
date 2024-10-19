import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { PricesModule } from '../prices/prices.module';
import { AlertsModule } from '../alerts/alerts.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [PricesModule, AlertsModule, EmailModule],
  providers: [TasksService],
})
export class TasksModule {}

