import { Controller, Get, Param, HttpException, HttpStatus } from '@nestjs/common';
import { PricesService } from './prices.service';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { Price } from './price.entity';

@ApiTags('Prices')
@Controller('prices')
export class PricesController {
  constructor(private readonly pricesService: PricesService) {}

  @Get(':chain')
  @ApiOperation({ summary: 'Get hourly prices for a chain within last 24 hours' })
  @ApiParam({ name: 'chain', enum: ['ethereum', 'polygon'] })
  @ApiResponse({ status: 200, description: 'List of prices', type: [Price] })
  async getHourlyPrices(@Param('chain') chain: string): Promise<Price[]> {
    if (!['ethereum', 'polygon'].includes(chain.toLowerCase())) {
      throw new HttpException('Invalid chain', HttpStatus.BAD_REQUEST);
    }
    return this.pricesService.getHourlyPrices(chain.toLowerCase());
  }
}

