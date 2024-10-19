import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Alert } from './alerts/alert.entity'; // Import the Alert entity

@Module({
  imports: [TypeOrmModule.forFeature([Alert])],
  exports: [TypeOrmModule],  // Export TypeOrmModule with entities
})
export class DatabaseModule {}