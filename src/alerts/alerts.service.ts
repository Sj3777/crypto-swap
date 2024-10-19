import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Alert } from './alert.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AlertsService {
  constructor(
    @InjectRepository(Alert)
    private readonly alertsRepository: Repository<Alert>,
  ) {
    // console.log('Alert Repository:', this.alertsRepository)
  }

  async getAllAlerts(): Promise<Alert[]> {
    return this.alertsRepository.find();
  }

  async createAlert(chain: string, targetPrice: number, email: string): Promise<Alert> {
    const alert = this.alertsRepository.create({ chain, targetPrice, email });
    return this.alertsRepository.save(alert);
  }

  async deleteAlert(id: number): Promise<void> {
    await this.alertsRepository.delete(id);
  }
}

