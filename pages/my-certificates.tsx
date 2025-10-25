import { useState, useEffect, useCallback } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import toast from "react-hot-toast";

interface Certificate {
  id: string;
  tokenId: string;
  tokenURI: string;
  txHash: string;
  courseId?: string;
  achievementId?: string;
  courseName?: string;
  achievementTitle?: string;
  courseDescription?: string;
  achievementDescription?: string;
  category?: string;
  studentAddress: string;
  studentName: string;
  completionDate: string;
  claimedAt: string;
  network: string;
  gasless: boolean;
  type?: "course" | "achievement";
}

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export default function MyCertificates() {
  const { address, isConnected } = useAccount();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isConnected && address) {
      loadCategories();
      loadCertificates();
    } else {
      setLoading(false);
    }
  }, [isConnected, address]);

  const loadCategories = useCallback(async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  }, []);

  const loadCertificates = async () => {
    if (!address) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/certificates/user/${address}`);
      
      if (response.ok) {
        const data = await response.json();
        setCertificates(data.certificates || []);
      } else {
        throw new Error("Failed to load certificates");
      }
    } catch (error) {
      console.error("Error loading certificates:", error);
      toast.error("Failed to load certificates");
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColorClass = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    switch (category?.color) {
      case 'blue': return 'from-blue-500 to-indigo-600';
      case 'orange': return 'from-orange-500 to-red-600';
      case 'green': return 'from-green-500 to-emerald-600';
      case 'purple': return 'from-purple-500 to-pink-600';
      case 'gray': return 'from-gray-400 to-gray-500';
      default: return 'from-purple-500 to-indigo-600';
    }
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.icon || '📌';
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || categoryId;
  };

  const getCertificateTitle = (cert: Certificate) => {
    return cert.courseName || cert.achievementTitle || 'Certificate';
  };

  const getCertificateDescription = (cert: Certificate) => {
    return cert.courseDescription || cert.achievementDescription || '';
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
            <Link href="/" className="text-gray-600 hover:text-primary-600">
              Dashboard
            </Link>
            <Link href="/my-achievements" className="text-gray-600 hover:text-primary-600">
              My Achievements
            </Link>
            <Link href="/verification" className="text-gray-600 hover:text-primary-600">
              Verification
            </Link>
            <ConnectButton />
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            My NFT Certificates
          </h2>
          <p className="text-gray-600">
            Your blockchain-verified achievement and course completion certificates
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
          <div className="card text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl">🎓</span>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              No Certificates Yet
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Complete and verify achievements to earn your first NFT certificate. Your certificates will appear here once claimed.
            </p>
            <Link href="/my-achievements" className="btn-primary inline-block">
              View My Achievements
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((certificate) => (
              <div key={certificate.id} className="card hover:shadow-xl transition-all duration-200 border-2 border-transparent hover:border-primary-200">
                <div className={`bg-gradient-to-br ${certificate.category ? getCategoryColorClass(certificate.category) : 'from-purple-500 to-indigo-600'} p-6 rounded-t-lg text-white relative`}>
                  {certificate.category && (
                    <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold">
                      {getCategoryIcon(certificate.category)} {getCategoryName(certificate.category)}
                    </div>
                  )}
                  <div className="text-center pt-4">
                    <div className="text-6xl mb-2">
                      {certificate.category ? getCategoryIcon(certificate.category) : '🎓'}
                    </div>
                    <h3 className="text-xl font-bold">NFT Certificate</h3>
                    <p className="text-sm text-white/80 mt-1">
                      {certificate.type === 'achievement' ? 'Achievement Verified' : 'Course Completed'}
                    </p>
                  </div>
                </div>

                <div className="p-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-2">
                    {getCertificateTitle(certificate)}
                  </h4>
                  
                  {getCertificateDescription(certificate) && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {getCertificateDescription(certificate)}
                    </p>
                  )}

                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Token ID:</span>
                      <span className="font-mono font-semibold text-primary-600">
                        #{certificate.tokenId}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium text-gray-900 capitalize">
                        {certificate.type === 'achievement' ? '🎯 Achievement' : '📚 Course'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Network:</span>
                      <span className="font-medium text-gray-900">{certificate.network}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Completed:</span>
                      <span className="font-medium text-gray-900">
                        {new Date(certificate.completionDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {certificate.gasless && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-2 mb-4">
                      <p className="text-xs text-green-800 font-medium text-center">
                        ⚡ Gasless Mint - No fees paid
                      </p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Link
                      href={`/certificates/${certificate.tokenId}`}
                      className="block w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white text-center font-semibold py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      🔍 View Full Profile
                    </Link>
                    <div className="flex gap-2">
                      <a
                        href={certificate.tokenURI}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-center font-semibold py-2 px-4 rounded-lg transition-all text-sm"
                      >
                        Metadata
                      </a>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(certificate.txHash);
                          toast.success("Transaction hash copied!");
                        }}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                        title="Copy TX Hash"
                      >
                        📋
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500 font-mono break-all">
                      TX: {certificate.txHash.slice(0, 10)}...{certificate.txHash.slice(-8)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
