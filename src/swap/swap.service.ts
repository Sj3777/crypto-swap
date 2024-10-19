import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class SwapService {
  private readonly logger = new Logger(SwapService.name);

  constructor() {}

  async getSwapRate(ethAmount: number): Promise<{
    btcAmount: number;
    feeEth: number;
    feeUSD: number;
  }> {
    try {
      // Fetch ETH to USD rate
      const ethResponse = await axios.get(
        'https://api.coingecko.com/api/v3/simple/price',
        {
          params: {
            ids: 'ethereum',
            vs_currencies: 'usd',
          },
        },
      );

      const ethPriceUSD = parseFloat(ethResponse.data.ethereum.usd);
      
      // Fetch BTC to USD rate
      const btcResponse = await axios.get(
        'https://api.coingecko.com/api/v3/simple/price',
        {
          params: {
            ids: 'bitcoin',
            vs_currencies: 'usd',
          },
        },
      );

      const btcPriceUSD = parseFloat(btcResponse.data.bitcoin.usd);

      const totalFeeEth = ethAmount * 0.0003; // 0.03% fee
      const feeUSD = totalFeeEth * ethPriceUSD;
      const ethAfterFee = ethAmount - totalFeeEth;
      const btcAmount = (ethAfterFee * ethPriceUSD) / btcPriceUSD;

      return {
        btcAmount: parseFloat(btcAmount.toFixed(8)),
        feeEth: parseFloat(totalFeeEth.toFixed(8)),
        feeUSD: parseFloat(feeUSD.toFixed(2)),
      };
    } catch (error) {
      this.logger.error('Error fetching swap rate', error);
      throw new HttpException('Failed to fetch swap rate', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}