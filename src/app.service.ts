import { Injectable } from '@nestjs/common';
import { Keypair } from '@solana/web3.js';
import { SwapService } from './shared/services/swap.service';
import * as bs58 from 'bs58';

@Injectable()
export class AppService {
  constructor(private readonly swapService: SwapService) {}

  getHello(): string {
    return 'EduLearn Bot - Auto SOL to EDLN Swap (Every 10 Hours)';
  }

}
