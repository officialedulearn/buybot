import { Injectable } from '@nestjs/common';
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  VersionedTransaction,
} from '@solana/web3.js';
import * as bs58 from 'bs58';
import { Wallet } from '@project-serum/anchor';
import axios from 'axios';
import { transactionSenderAndConfirmationWaiter } from '../transaction/transactionSender';

@Injectable()
export class SwapService {
  private readonly EDLN: PublicKey = new PublicKey(
    'CFw2KxMpWuxivoowkF8vRCrnMuDeg5VMHRR7zjE7pBLV',
  );
  private readonly connection = new Connection(
    'https://api.mainnet-beta.solana.com',
  );
  private readonly heliusConnection = new Connection(
    "https://mainnet.helius-rpc.com/?api-key=36181439-ce38-4a9f-8adc-d413c0a4e218"
  );

  constructor() {}

  async swapSolToEdln(keypair: Keypair, amount: number) {
    const wallet = new Wallet(keypair);

    const axiosInstance = axios.create({
      timeout: 30000,
    });
    
    const jupiterApiEndpoints = [
      'https://quote-api.jup.ag/v6',
      'https://jupiter-quote-api.saihubd.xyz/v6',
      'https://jupiter-quote-api.bonfida.com/v6'
    ];
    
    try {
      console.log(`[${new Date().toISOString()}] Swapping ${amount} SOL to EDLN`);
      
      let quoteResponse;
      let currentEndpointIndex = 0;
      
      while (!quoteResponse && currentEndpointIndex < jupiterApiEndpoints.length) {
        const baseUrl = jupiterApiEndpoints[currentEndpointIndex];
        const quoteUrl = `${baseUrl}/quote?inputMint=So11111111111111111111111111111111111111112&outputMint=CFw2KxMpWuxivoowkF8vRCrnMuDeg5VMHRR7zjE7pBLV&amount=${amount * LAMPORTS_PER_SOL}&slippageBps=50`;
        
        try {
          quoteResponse = await axiosInstance.get(quoteUrl);
          console.log(`Quote received from ${baseUrl}`);
        } catch (error) {
          console.warn(`Failed to get quote from ${baseUrl}:`, error.message);
          currentEndpointIndex++;
        }
      }
      
      if (!quoteResponse) {
        throw new Error('Failed to get quote from any Jupiter API endpoint');
      }
      
      let swapTx;
      currentEndpointIndex = 0;
      
      while (!swapTx && currentEndpointIndex < jupiterApiEndpoints.length) {
        const baseUrl = jupiterApiEndpoints[currentEndpointIndex];
        const swapUrl = `${baseUrl}/swap`;
        
        try {
          swapTx = await axiosInstance.post(swapUrl, {
            quoteResponse: quoteResponse.data,
            userPublicKey: wallet.publicKey.toString(),
            wrapAndUnwrapSol: true,
            feeAccount: 'BTxbf6nkRX2wUiNpBVhA5SytPvST7KvEQoBDWVfpcvtv',
          });
          console.log(`Swap transaction received from ${baseUrl}`);
        } catch (error) {
          console.warn(`Failed to get swap transaction from ${baseUrl}:`, error.message);
          currentEndpointIndex++;
        }
      }
      
      if (!swapTx) {
        throw new Error('Failed to get swap transaction from any Jupiter API endpoint');
      }

      const { swapTransaction } = swapTx.data;
      const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
      const transaction = VersionedTransaction.deserialize(swapTransactionBuf);

      transaction.sign([keypair]);

      const blockhashWithExpiryBlockHeight = await this.heliusConnection.getLatestBlockhash();

      const txResponse = await transactionSenderAndConfirmationWaiter({
        connection: this.heliusConnection,
        serializedTransaction: Buffer.from(transaction.serialize()),
        blockhashWithExpiryBlockHeight,
      });

      if (!txResponse) {
        throw new Error('Transaction failed or expired');
      }

      const txid = txResponse.transaction.signatures[0];
      console.log(`[${new Date().toISOString()}] Swap successful! Signature: ${txid}`);
      
      return {
        signature: txid,
        amount: amount,
        success: true
      };
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Swap failed:`, error.message);
      throw new Error(`Swap failed: ${error.message}`);
    }
  }
}