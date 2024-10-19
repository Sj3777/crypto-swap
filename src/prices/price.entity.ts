import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Price {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chain: string; // 'ethereum' or 'polygon'

  @Column('decimal', { precision: 18, scale: 8 })
  price: number;

  @CreateDateColumn()
  timestamp: Date;
}
