import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAILER_HOST,
      port: parseInt(process.env.MAILER_PORT) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASS,
      },
    });
  }

  async sendPriceIncreaseAlert(chain: string, price: number) {
    const mailOptions = {
      from: `"Crypto Monitor" <${process.env.MAILER_USER}>`,
      to: 'hyperhire_assignment@hyperhire.in',
      subject: `${chain} Price Alert`,
      text: `The price of ${chain} has increased by more than 3% in the last hour. Current price: $${price}`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Price increase alert sent for ${chain}`);
    } catch (error) {
      this.logger.error('Error sending price increase alert email', error);
    }
  }

  async sendUserAlert(email: string, chain: string, targetPrice: number, currentPrice: number) {
    const mailOptions = {
      from: `"Crypto Monitor" <${process.env.MAILER_USER}>`,
      to: email,
      subject: `${chain} Price Reached`,
      text: `Hello,

Your alert for ${chain} has been triggered.

Target Price: $${targetPrice}
Current Price: $${currentPrice}

Regards,
Crypto Monitor Team`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`User alert email sent to ${email} for ${chain}`);
    } catch (error) {
      this.logger.error('Error sending user alert email', error);
    }
  }
}
