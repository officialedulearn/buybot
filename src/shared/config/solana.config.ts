export const SOLANA_CONFIG = {
  // Token addresses
  EDLN_MINT: 'CFw2KxMpWuxivoowkF8vRCrnMuDeg5VMHRR7zjE7pBLV',
  SOL_MINT: 'So11111111111111111111111111111111111111112',
  USDC_MINT: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  
  // RPC endpoints
  MAINNET_RPC: 'https://api.mainnet-beta.solana.com',
  HELIUS_RPC: 'https://mainnet.helius-rpc.com/?api-key=36181439-ce38-4a9f-8adc-d413c0a4e218',
  
  // Jupiter API endpoints
  JUPITER_ENDPOINTS: [
    'https://quote-api.jup.ag/v6',
    'https://jupiter-quote-api.saihubd.xyz/v6',
    'https://jupiter-quote-api.bonfida.com/v6'
  ],
  
  // Fee account
  FEE_ACCOUNT: 'BTxbf6nkRX2wUiNpBVhA5SytPvST7KvEQoBDWVfpcvtv',
  
  // Token decimals
  DECIMALS: {
    SOL: 9,
    EDLN: 9,
    USDC: 6,
  },
  
  // Swap settings
  SLIPPAGE_BPS: 50, // 0.5%
  TIMEOUT_MS: 30000,
};