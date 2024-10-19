import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { SwapService } from './swap.service';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';

class SwapDto {
  ethAmount: number;
}

class SwapResponseDto {
  btcAmount: number;
  feeEth: number;
  feeUSD: number;
}

@ApiTags('Swap')
@Controller('swap')
export class SwapController {
  constructor(private readonly swapService: SwapService) {}

  @Post('rate')
  @ApiOperation({ summary: 'Get swap rate from ETH to BTC' })
  @ApiBody({ type: SwapDto })
  @ApiResponse({ status: 200, description: 'Swap rate retrieved', type: SwapResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async getSwapRate(@Body() swapDto: SwapDto): Promise<SwapResponseDto> {
    const { ethAmount } = swapDto;

    if (ethAmount <= 0) {
      throw new HttpException('ETH amount must be positive', HttpStatus.BAD_REQUEST);
    }

    return this.swapService.getSwapRate(ethAmount);
  }
}

