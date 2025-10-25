import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useCertificateNFT } from "../hooks/useCertificateNFT";
import CertificateCard from "../components/CertificateCard";

interface Certificate {
  tokenId: string;
  courseId: string;
  courseName: string;
  studentName: string;
  completionDate: Date;
  tokenURI: string;
}

export default function MyCertificates() {
  const { address, isConnected } = useAccount();
  const { getUserCertificates, getCertificateData } = useCertificateNFT();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isConnected && address) {
      loadCertificates();
    }
  }, [isConnected, address]);

  const loadCertificates = async () => {
    if (!address) return;

    setLoading(true);
    try {
      const tokenIds = await getUserCertificates();
      const certificateData = await Promise.all(
        tokenIds.map(async (tokenId: string) => {
          const data = await getCertificateData(tokenId);
          return data ? { tokenId, ...data } : null;
        })
      );
      
      setCertificates(certificateData.filter(Boolean) as Certificate[]);
    } catch (error) {
      console.error("Error loading certificates:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Connect Your Wallet
          </h1>
          <p className="text-gray-600 mb-8">
            Connect your wallet to view your NFT certificates
          </p>
          <ConnectButton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary-600">Proofy NFT</h1>
          <div className="flex items-center space-x-4">
            <a href="/" className="text-gray-600 hover:text-primary-600">
              Courses
            </a>
            <ConnectButton />
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            My Certificates
          </h2>
          <p className="text-gray-600">
            Your blockchain-verified course completion certificates
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : certificates.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">📜</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Certificates Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Complete courses to earn your first NFT certificate
            </p>
            <a href="/" className="btn-primary">
              Browse Courses
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((certificate) => (
              <CertificateCard key={certificate.tokenId} certificate={certificate} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
