import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import toast from "react-hot-toast";

interface Certificate {
  id: string;
  tokenId: string;
  tokenURI: string;
  txHash: string;
  courseId?: string | null;
  achievementId?: string | null;
  category?: string;
  courseName: string;
  courseDescription: string;
  specificData?: any;
  studentAddress: string;
  studentName: string;
  completionDate: string;
  claimedAt: string;
  network: string;
  gasless: boolean;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

const getCategoryGradient = (color: string) => {
  const gradients: Record<string, string> = {
    blue: 'from-blue-500 via-indigo-500 to-purple-600',
    orange: 'from-orange-500 via-red-500 to-pink-600',
    green: 'from-green-500 via-emerald-500 to-teal-600',
    purple: 'from-purple-500 via-pink-500 to-rose-600',
    gray: 'from-gray-500 via-slate-500 to-zinc-600',
  };
  return gradients[color] || gradients.gray;
};

const getCategoryBgGradient = (color: string) => {
  const gradients: Record<string, string> = {
    blue: 'from-blue-50 to-indigo-50',
    orange: 'from-orange-50 to-red-50',
    green: 'from-green-50 to-emerald-50',
    purple: 'from-purple-50 to-pink-50',
    gray: 'from-gray-50 to-slate-50',
  };
  return gradients[color] || gradients.gray;
};

export default function CertificateProfile() {
  const router = useRouter();
  const { tokenId } = router.query;
  const { address, isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [categories, setCategories] = useState<Record<string, Category>>({});
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isConnected && address && tokenId) {
      loadCategories();
      loadCertificate();
    }
  }, [isConnected, address, tokenId]);

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        const catMap = data.categories.reduce((acc: any, cat: Category) => {
          acc[cat.id] = cat;
          return acc;
        }, {});
        setCategories(catMap);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadCertificate = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/certificates/user/${address}`);
      if (response.ok) {
        const data = await response.json();
        const cert = data.certificates.find((c: Certificate) => c.tokenId === tokenId);
        if (cert) {
          setCertificate(cert);
        } else {
          toast.error("Certificate not found");
          router.push('/my-certificates');
        }
      }
    } catch (error) {
      console.error("Error loading certificate:", error);
      toast.error("Failed to load certificate");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyTxHash = () => {
    if (certificate?.txHash) {
      navigator.clipboard.writeText(certificate.txHash);
      setCopied(true);
      toast.success("Transaction hash copied!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyTokenId = () => {
    if (certificate?.tokenId) {
      navigator.clipboard.writeText(certificate.tokenId);
      toast.success("Token ID copied!");
    }
  };

  const handleShare = () => {
    if (certificate) {
      const shareUrl = `${window.location.origin}/certificates/${certificate.tokenId}`;
      navigator.clipboard.writeText(shareUrl);
      toast.success("Certificate link copied! Share it with others.");
    }
  };

  const handleDownloadMetadata = () => {
    if (!certificate) return;
    
    const metadata = {
      name: `${certificate.courseName} - NFT Certificate`,
      description: certificate.courseDescription,
      tokenId: certificate.tokenId,
      category: certificate.category,
      student: certificate.studentAddress,
      completionDate: certificate.completionDate,
      network: certificate.network,
      txHash: certificate.txHash,
      specificData: certificate.specificData,
    };

    const blob = new Blob([JSON.stringify(metadata, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `certificate-${certificate.tokenId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Metadata downloaded!");
  };

  if (!mounted) return null;

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Connect Your Wallet
          </h1>
          <p className="text-gray-600 mb-8">
            Connect your wallet to view your certificate
          </p>
          <ConnectButton />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-primary-600">
              Proofy
            </Link>
            <ConnectButton />
          </div>
        </nav>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-96 bg-gray-200 rounded-xl"></div>
            <div className="h-64 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Certificate Not Found
          </h1>
          <Link href="/my-certificates" className="btn-primary">
            View My Certificates
          </Link>
        </div>
      </div>
    );
  }

  const category = categories[certificate.category || 'education'] || {
    id: 'education',
    name: 'Education',
    icon: '🎓',
    color: 'blue',
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getCategoryBgGradient(category.color)}`}>
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-lg shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-primary-600">
            Proofy
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/my-certificates" className="text-gray-600 hover:text-primary-600 transition-colors">
              ← Back to Certificates
            </Link>
            <ConnectButton />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section - NFT Card */}
        <div className="mb-8">
          <div className={`relative overflow-hidden rounded-3xl shadow-2xl bg-gradient-to-br ${getCategoryGradient(category.color)} p-8 md:p-12 text-white transform hover:scale-[1.02] transition-all duration-300`}>
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{ 
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
              }}></div>
            </div>

            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center text-5xl shadow-lg">
                    {category.icon}
                  </div>
                  <div>
                    <div className="text-white/80 text-sm font-medium mb-1">
                      NFT Certificate
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold">
                      {certificate.courseName}
                    </h1>
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur-lg px-4 py-2 rounded-full text-sm font-semibold">
                  {category.name}
                </div>
              </div>

              <p className="text-white/90 text-lg mb-8 max-w-3xl">
                {certificate.courseDescription}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
                  <div className="text-white/70 text-sm mb-1">Token ID</div>
                  <div className="text-2xl font-bold">#{certificate.tokenId}</div>
                </div>
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
                  <div className="text-white/70 text-sm mb-1">Network</div>
                  <div className="text-xl font-semibold">{certificate.network}</div>
                </div>
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
                  <div className="text-white/70 text-sm mb-1">Completion Date</div>
                  <div className="text-xl font-semibold">
                    {new Date(certificate.completionDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Student Info */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">👤</span>
              Student Information
            </h3>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-500 mb-1">Wallet Address</div>
                <div className="font-mono text-sm bg-gray-100 px-3 py-2 rounded-lg break-all">
                  {certificate.studentAddress}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Name</div>
                <div className="font-semibold text-gray-900">{certificate.studentName}</div>
              </div>
            </div>
          </div>

          {/* NFT Details */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">🎫</span>
              NFT Details
            </h3>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-500 mb-1">Token URI</div>
                <a 
                  href={certificate.tokenURI} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 text-sm break-all"
                >
                  {certificate.tokenURI}
                </a>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Minting Type</div>
                {certificate.gasless ? (
                  <div className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                    <span className="mr-1">⚡</span>
                    Gasless Mint
                  </div>
                ) : (
                  <div className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                    Standard Mint
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Blockchain Info */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">🔗</span>
              Blockchain
            </h3>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-500 mb-1">Transaction Hash</div>
                <div className="flex items-center space-x-2">
                  <div className="font-mono text-xs bg-gray-100 px-3 py-2 rounded-lg break-all flex-1">
                    {certificate.txHash.slice(0, 10)}...{certificate.txHash.slice(-8)}
                  </div>
                  <button
                    onClick={handleCopyTxHash}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Copy full hash"
                  >
                    {copied ? '✅' : '📋'}
                  </button>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Claimed At</div>
                <div className="font-semibold text-gray-900">
                  {new Date(certificate.claimedAt).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievement Specific Data */}
        {certificate.specificData && Object.keys(certificate.specificData).length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">📊</span>
              Achievement Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(certificate.specificData).map(([key, value]) => (
                <div key={key} className="bg-gray-50 rounded-xl p-4">
                  <div className="text-sm text-gray-500 mb-1 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  <div className="font-semibold text-gray-900">
                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={handleShare}
              className="flex flex-col items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors group"
            >
              <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">🔗</span>
              <span className="text-sm font-semibold text-blue-900">Share Link</span>
            </button>

            <button
              onClick={handleCopyTokenId}
              className="flex flex-col items-center justify-center p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors group"
            >
              <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">🎫</span>
              <span className="text-sm font-semibold text-purple-900">Copy Token ID</span>
            </button>

            <button
              onClick={handleDownloadMetadata}
              className="flex flex-col items-center justify-center p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors group"
            >
              <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">💾</span>
              <span className="text-sm font-semibold text-green-900">Download Metadata</span>
            </button>

            <a
              href={`https://sepolia.etherscan.io/tx/${certificate.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-4 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors group"
            >
              <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">🔍</span>
              <span className="text-sm font-semibold text-orange-900">View on Explorer</span>
            </a>
          </div>
        </div>

        {/* Verification Badge */}
        <div className="mt-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg p-6 text-white text-center">
          <div className="text-5xl mb-3">✓</div>
          <h3 className="text-2xl font-bold mb-2">Verified Achievement</h3>
          <p className="text-white/90">
            This certificate has been verified and minted on the blockchain.
            <br />
            It represents a legitimate achievement that cannot be forged or altered.
          </p>
        </div>
      </div>
    </div>
  );
}

