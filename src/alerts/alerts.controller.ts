import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';

class SetAlertDto {
  chain: string; // 'ethereum' or 'polygon'
  targetPrice: number;
  email: string;
}

@ApiTags('Alerts')
@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Post()
  @ApiOperation({ summary: 'Set a price alert' })
  @ApiBody({ type: SetAlertDto })
  @ApiResponse({ status: 201, description: 'Alert created' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async setAlert(@Body() setAlertDto: SetAlertDto) {
    const { chain, targetPrice, email } = setAlertDto;

    if (!['ethereum', 'polygon'].includes(chain.toLowerCase())) {
      throw new HttpException('Invalid chain', HttpStatus.BAD_REQUEST);
    }

    if (targetPrice <= 0) {
      throw new HttpException('Target price must be positive', HttpStatus.BAD_REQUEST);
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new HttpException('Invalid email', HttpStatus.BAD_REQUEST);
    }

    const alert = await this.alertsService.createAlert(chain.toLowerCase(), targetPrice, email);
    return { message: 'Alert set successfully', alert };
  }
}

