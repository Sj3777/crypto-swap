
// src/prices/prices.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Price } from './price.entity';
import { Repository } from 'typeorm';
import axios from 'axios';

@Injectable()
export class PricesService {
  private readonly logger = new Logger(PricesService.name);

  constructor(
    @InjectRepository(Price)
    private priceRepository: Repository<Price>,
  ) {}

  // Fetch and save prices for Ethereum and Polygon every 5 minutes
  async fetchAndSavePrices() {
    try {
      const chains = ['ethereum', 'polygon'];
      for (const chain of chains) {
        const price = await this.getPrice(chain);
        if (price !== null) {
          const priceEntity = this.priceRepository.create({ chain, price });
          await this.priceRepository.save(priceEntity);
          this.logger.log(`Saved ${chain} price: ${price}`);
        } else {
          this.logger.error(`Failed to fetch price for ${chain}`);
        }
      }
    } catch (error) {
      this.logger.error('Error fetching and saving prices', error);
    }
  }

  // Fetch token price from CoinGecko API
  async getPrice(chain: string): Promise<number | null> {
    try {
      let coinId: string;

      // Map the chain to CoinGecko's coin ID
      if (chain === 'ethereum') {
        coinId = 'ethereum';
      } else if (chain === 'polygon') {
        coinId = 'matic-network'; // CoinGecko uses 'matic-network' for Polygon
      } else {
        this.logger.error(`Invalid chain: ${chain}`);
        return null;
      }

      const response = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price`,
        {
          params: {
            ids: coinId,
            vs_currencies: 'usd',
          },
        },
      );

      // Extracting the price from the response
      const usdPrice = response.data[coinId]?.usd;
      this.logger.log(`${chain} current price: ${usdPrice}`);
      return usdPrice !== undefined ? parseFloat(usdPrice) : null;
    } catch (error) {
      this.logger.error(`Error fetching price for ${chain}:`, error.response?.data || error.message);
      return null;
    }
  }

  // Fetch hourly prices for the last 24 hours
  async getHourlyPrices(chain: string): Promise<Price[]> {
    const oneDayAgo = new Date();
    oneDayAgo.setHours(oneDayAgo.getHours() - 24);
    
    return this.priceRepository.find({
      where: {
        chain,
        // timestamp: () => timestamp >= '${oneDayAgo.toISOString()}',
      },
      order: { timestamp: 'DESC' },
    });
  }

    async getLatestPrice(chain: string): Promise<Price | undefined> {
    return this.priceRepository.findOne({
      where: { chain },
      order: { timestamp: 'DESC' },
    });
  }

  async getPriceOneHourAgo(chain: string): Promise<Price | undefined> {
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);
    return this.priceRepository.findOne({
      where: {
        chain,
        // timestamp: () => `timestamp <= '${oneHourAgo.toISOString()}'`,
      },
      order: { timestamp: 'DESC' },
    });
  }

}