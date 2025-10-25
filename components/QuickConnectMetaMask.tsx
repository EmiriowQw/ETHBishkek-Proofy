import { useConnect, useAccount } from "wagmi";
import { useEffect, useState } from "react";

export default function QuickConnectMetaMask() {
  const { connect, connectors, isLoading } = useConnect();
  const { isConnected } = useAccount();
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);

  useEffect(() => {
    // Check if MetaMask is installed
    if (typeof window !== 'undefined' && window.ethereum) {
      setIsMetaMaskInstalled(true);
    }
  }, []);

  const handleQuickConnect = async () => {
    // Find MetaMask connector
    const metamaskConnector = connectors.find(
      (connector) => connector.id === "metaMask" || connector.name === "MetaMask"
    );

    if (metamaskConnector) {
      try {
        await connect({ connector: metamaskConnector });
      } catch (error) {
        console.error("Quick connect failed:", error);
      }
    } else if (!isMetaMaskInstalled) {
      // Open MetaMask download page
      window.open("https://metamask.io/download/", "_blank");
    }
  };

  // Don't show if already connected
  if (isConnected) return null;

  return (
    <button
      onClick={handleQuickConnect}
      disabled={isLoading}
      className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <span className="text-xl">🦊</span>
      <span>
        {isLoading 
          ? "Connecting..." 
          : isMetaMaskInstalled 
            ? "Quick Connect MetaMask" 
            : "Install MetaMask"
        }
      </span>
    </button>
  );
}

