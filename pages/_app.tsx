import type { AppProps } from "next/app";
import {
  RainbowKitProvider,
  connectorsForWallets,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import {
  metaMaskWallet,
  coinbaseWallet,
  walletConnectWallet,
  trustWallet,
  rainbowWallet,
  injectedWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, goerli, sepolia } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { Toaster } from "react-hot-toast";
import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";

// Status Network configuration
const statusSepolia = {
  id: 436,
  name: "Status Sepolia",
  network: "status-sepolia",
  nativeCurrency: {
    decimals: 18,
    name: "Status",
    symbol: "SNT",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.status.im/"],
    },
    public: {
      http: ["https://rpc.status.im/"],
    },
  },
  blockExplorers: {
    default: { name: "Status Explorer", url: "https://sepolia.status.im/" },
  },
  testnet: true,
};

// Configure chains with better caching and performance
const { chains, publicClient } = configureChains(
  [mainnet, polygon, optimism, arbitrum, goerli, sepolia, statusSepolia],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID || "" }),
    publicProvider(),
  ],
  {
    pollingInterval: 10_000, // 10 seconds - reduce network calls
    stallTimeout: 5_000, // 5 seconds - faster timeout
  }
);

// Configure wallets with explicit MetaMask priority for faster connection
const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: [
      // MetaMask FIRST for priority and speed
      metaMaskWallet({ 
        chains,
        projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "default-project-id",
      }),
      // Injected wallet catches any browser extension wallet
      injectedWallet({ chains }),
      // WalletConnect for mobile connections
      walletConnectWallet({
        chains,
        projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "default-project-id",
      }),
    ],
  },
  {
    groupName: "Other Options",
    wallets: [
      coinbaseWallet({ 
        appName: "Proofy - Proof of Anything",
        chains,
      }),
      trustWallet({ 
        chains,
        projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "default-project-id",
      }),
      rainbowWallet({ 
        chains,
        projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "default-project-id",
      }),
    ],
  },
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider 
        chains={chains}
        modalSize="compact"
        appInfo={{
          appName: "Proofy - Proof of Anything",
          learnMoreUrl: "https://github.com/proofy",
        }}
        theme={darkTheme({
          accentColor: "#3b82f6",
          accentColorForeground: "white",
          borderRadius: "large",
        })}
      >
        <Component {...pageProps} />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: 'white',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: 'white',
              },
            },
          }}
        />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
