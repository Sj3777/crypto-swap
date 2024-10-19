import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Alert {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chain: string; // 'ethereum' or 'polygon'

  @Column('decimal', { precision: 18, scale: 8 })
  targetPrice: number;

  @Column()
  email: string;

  @CreateDateColumn()
  createdAt: Date;
}
