import { Injectable, Logger } from '@nestjs/common';
import { PricesService } from '../prices/prices.service';
import { AlertsService } from '../alerts/alerts.service';
import { EmailService } from '../email/email.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    private readonly pricesService: PricesService,
    private readonly alertsService: AlertsService,
    private readonly emailService: EmailService,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async handlePriceFetchAndAlerts() {
    this.logger.log('Fetching and saving prices...');
    await this.pricesService.fetchAndSavePrices();

    this.logger.log('Checking for price increase alerts...');
    await this.checkPriceIncreaseAlerts();

    this.logger.log('Checking for user-set price alerts...');
    await this.checkUserSetAlerts();
  }

  async checkPriceIncreaseAlerts() {
    const chains = ['ethereum', 'polygon'];
    for (const chain of chains) {
      const latestPrice = await this.pricesService.getLatestPrice(chain);
      const oneHourAgoPrice = await this.pricesService.getPriceOneHourAgo(chain);

      if (!latestPrice || !oneHourAgoPrice) continue;

      const increase = ((latestPrice.price - oneHourAgoPrice.price) / oneHourAgoPrice.price) * 100;

      if (increase > 3) {
        await this.emailService.sendPriceIncreaseAlert(chain, latestPrice.price);
      }
    }
  }

  async checkUserSetAlerts() {
    const alerts = await this.alertsService.getAllAlerts();
    for (const alert of alerts) {
      const latestPrice = await this.pricesService.getLatestPrice(alert.chain);
      if (latestPrice && latestPrice.price >= alert.targetPrice) {
        await this.emailService.sendUserAlert(alert.email, alert.chain, alert.targetPrice, latestPrice.price);
        await this.alertsService.deleteAlert(alert.id); // Optionally delete after alerting
      }
    }
  }
}

