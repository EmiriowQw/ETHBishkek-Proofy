import type { AppProps } from "next/app";
import { RainbowKitProvider, getDefaultWallets, connectorsForWallets } from "@rainbow-me/rainbowkit";
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

const { chains, publicClient } = configureChains(
  [mainnet, polygon, optimism, arbitrum, goerli, sepolia, statusSepolia],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID || "" }),
    publicProvider(),
  ]
);

const { wallets } = getDefaultWallets({
  appName: "Proofy NFT",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "default-project-id",
  chains,
});

const connectors = connectorsForWallets([
  ...wallets,
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <Component {...pageProps} />
        <Toaster position="top-right" />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
