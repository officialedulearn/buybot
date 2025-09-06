import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SwapService } from '../shared/services/swap.service';
import { Keypair } from '@solana/web3.js';
import * as bs58 from 'bs58';

@Injectable()
export class CronService {
  constructor(private readonly swapService: SwapService) {}

  @Cron('0 */10 * * *') 
  async autoSwapSolToEdln() {
    try {
      const privateKey = process.env.BUYER_KEY;
      if (!privateKey) {
        console.error('[CRON] BUYER_KEY environment variable not set');
        return;
      }

      let keypair: Keypair;
      try {
        const secretKeyArray = Uint8Array.from(privateKey.split(',').map((s) => parseInt(s)));
        keypair = Keypair.fromSecretKey(secretKeyArray);
      } catch {
        keypair = Keypair.fromSecretKey(bs58.default.decode(privateKey));
      }

      console.log(`[CRON] ${new Date().toISOString()} - Starting automatic SOL to EDLN swap`);
      console.log(`[CRON] Bot wallet: ${keypair.publicKey.toBase58()}`);

      const swapAmount = 0.0001; 
      const result = await this.swapService.swapSolToEdln(keypair, swapAmount);
      
      console.log(`[CRON] ${new Date().toISOString()} - Automatic swap completed successfully`);
      console.log(`[CRON] Transaction: https://solscan.io/tx/${result.signature}`);
      
    } catch (error) {
      console.error(`[CRON] ${new Date().toISOString()} - Automatic swap failed:`, error.message);
    }
  }

  @Cron('0 */5 * * *') 
  async autoSwapSolToEdlnFiveHours() {
    try {
      const privateKey = process.env.BUYER_KEY;
      if (!privateKey) {
        console.error('[CRON] BUYER_KEY environment variable not set');
        return;
      }

      let keypair: Keypair;
      try {
        const secretKeyArray = Uint8Array.from(privateKey.split(',').map((s) => parseInt(s)));
        keypair = Keypair.fromSecretKey(secretKeyArray);
      } catch {
        keypair = Keypair.fromSecretKey(bs58.default.decode(privateKey));
      }

      console.log(`[CRON] ${new Date().toISOString()} - Starting automatic SOL to EDLN swap (5-hour interval)`);
      console.log(`[CRON] Bot wallet: ${keypair.publicKey.toBase58()}`);

      const swapAmount = 0.0001; 
      const result = await this.swapService.swapSolToEdln(keypair, swapAmount);
      
      console.log(`[CRON] ${new Date().toISOString()} - Automatic swap (5-hour) completed successfully`);
      console.log(`[CRON] Transaction: https://solscan.io/tx/${result.signature}`);
      
    } catch (error) {
      console.error(`[CRON] ${new Date().toISOString()} - Automatic swap (5-hour) failed:`, error.message);
    }
  }
}