import { cookieStorage, createStorage } from '@wagmi/core';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { sepolia, baseSepolia, mainnet, type AppKitNetwork } from '@reown/appkit/networks';

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || 'YOUR_REOWN_PROJECT_ID';

// Shift Sepolia to the front of the array
export const networks = [sepolia, baseSepolia, mainnet] as [AppKitNetwork, ...AppKitNetwork[]];

// Set Sepolia as the default so the UI loads your new contracts immediately
export const defaultNetwork = sepolia;

const customRpcUrls: Record<string, { url: string }[]> = {
  'eip155:11155111': [{ url: 'https://rpc.sepolia.org' }],
  'eip155:84532': [{ url: 'https://sepolia.base.org' }],
  'eip155:1': [{ url: 'https://cloudflare-eth.com' }],
};

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({ storage: cookieStorage }),
  networks,
  projectId,
  customRpcUrls,
  // This enables the magic "Smart Wallet" popup for Coinbase users
  coinbaseWallet: { 
    appName: 'TRECC Protocol',
    preference: 'smartWalletOnly' 
  }
});

export const config = wagmiAdapter.wagmiConfig;
export { customRpcUrls };