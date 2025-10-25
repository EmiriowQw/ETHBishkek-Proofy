import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import QuickConnectMetaMask from "../components/QuickConnectMetaMask";

interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

export default function Home() {
  const { address, isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    loadCategories();
  }, []);

  const loadCategories = useCallback(async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        // Get first 4 categories for showcase
        setCategories((data.categories || []).slice(0, 4));
      }
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  }, []);

  const getCategoryColorClass = (color: string) => {
    switch (color) {
      case 'blue': return 'from-blue-500 to-indigo-600';
      case 'orange': return 'from-orange-500 to-red-600';
      case 'green': return 'from-green-500 to-emerald-600';
      case 'purple': return 'from-purple-500 to-pink-600';
      case 'gray': return 'from-gray-400 to-gray-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  if (!mounted) {
    return null;
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-blue-50 to-purple-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="mb-8">
              <div className="inline-flex items-center space-x-2 bg-white rounded-full px-6 py-3 shadow-lg mb-6">
                <span className="text-2xl">🎯</span>
                <span className="font-bold text-gray-900">Proof of Anything</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Welcome to <span className="text-primary-600">Proofy</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Universal blockchain verification platform for <strong>any achievement</strong>.
                From education to sports, volunteering to skills - prove it, verify it, own it as an NFT!
              </p>
            </div>
            
            <div className="flex flex-col items-center space-y-4 mb-16">
              <QuickConnectMetaMask />
              <div className="text-gray-500 text-sm">or</div>
              <ConnectButton />
            </div>

            {/* Category Showcase */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                What Can You Verify?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Create verifiable NFT certificates for achievements across all categories
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
                {categories.map((category) => (
                  <div key={category.id} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200">
                    <div className={`w-16 h-16 bg-gradient-to-br ${getCategoryColorClass(category.color)} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <span className="text-3xl">{category.icon}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">{category.name}</h3>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* How It Works */}
            <div className="max-w-5xl mx-auto mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                How It Works
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                    1
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">Create Achievement</h3>
                  <p className="text-gray-600">
                    Select a category (or create your own) and describe your achievement with proof
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                    2
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">Get Verified</h3>
                  <p className="text-gray-600">
                    Category experts review and verify your achievement authenticity
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                    3
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">Claim NFT</h3>
                  <p className="text-gray-600">
                    Receive your unique NFT certificate on the blockchain (gasless!)
                  </p>
                </div>
              </div>
            </div>

            {/* Key Features */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center bg-white rounded-xl p-6 shadow-md">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">⚡</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Gasless Minting</h3>
                <p className="text-gray-600">
                  No gas fees - we cover all blockchain transaction costs for you
                </p>
              </div>
              <div className="text-center bg-white rounded-xl p-6 shadow-md">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🛡️</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Expert Verification</h3>
                <p className="text-gray-600">
                  Category-specific verifiers ensure authenticity and quality
                </p>
              </div>
              <div className="text-center bg-white rounded-xl p-6 shadow-md">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🔗</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Blockchain Verified</h3>
                <p className="text-gray-600">
                  Permanently recorded and verifiable on Status Network
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary-600">Proofy</h1>
          <div className="flex items-center space-x-4">
            <Link href="/my-achievements" className="text-gray-600 hover:text-primary-600">
              My Achievements
            </Link>
            <Link href="/my-certificates" className="text-gray-600 hover:text-primary-600">
              My Certificates
            </Link>
            <Link href="/verification" className="text-gray-600 hover:text-primary-600">
              Verification
            </Link>
            <Link href="/become-verifier" className="text-gray-600 hover:text-primary-600">
              Become Verifier
            </Link>
            <ConnectButton />
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-primary-500 to-blue-600 rounded-2xl p-8 md:p-12 text-white mb-8 shadow-xl">
          <div className="max-w-3xl">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
              <span className="text-2xl">🎯</span>
              <span className="font-semibold">Proof of Anything Platform</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Welcome back, {address?.slice(0, 6)}...{address?.slice(-4)}!
            </h2>
            <p className="text-xl text-white/90 mb-6">
              Create, verify, and collect NFT certificates for any achievement
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => router.push('/create-achievement')}
                className="bg-white text-primary-600 hover:bg-gray-100 font-bold py-3 px-6 rounded-lg transition-all"
              >
                ➕ Create Achievement
              </button>
              <button
                onClick={() => router.push('/my-achievements')}
                className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-bold py-3 px-6 rounded-lg transition-all"
              >
                View My Achievements →
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Achievements</p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900">-</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
            </div>
          </div>

          <div className="card hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Verified</p>
                <p className="text-2xl md:text-3xl font-bold text-green-600">-</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>

          <div className="card hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Pending</p>
                <p className="text-2xl md:text-3xl font-bold text-yellow-600">-</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">⏳</span>
              </div>
            </div>
          </div>

          <div className="card hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">NFT Certificates</p>
                <p className="text-2xl md:text-3xl font-bold text-purple-600">-</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🎓</span>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Showcase */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold text-gray-900">
              Achievement Categories
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                onClick={() => router.push('/create-achievement')}
                className="card hover:shadow-xl transition-all duration-200 cursor-pointer group"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${getCategoryColorClass(category.color)} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <span className="text-3xl">{category.icon}</span>
                </div>
                <h4 className="font-bold text-gray-900 text-center mb-2">{category.name}</h4>
                <p className="text-sm text-gray-600 text-center line-clamp-2">
                  {category.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            className="card hover:shadow-xl transition-all duration-200 cursor-pointer border-2 border-transparent hover:border-primary-500"
            onClick={() => router.push('/create-achievement')}
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">✍️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Create Achievement
              </h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Document your accomplishments across education, sports, volunteering, skills, or create your own category.
            </p>
            <div className="text-primary-600 font-semibold text-sm flex items-center">
              Get started →
            </div>
          </div>

          <div
            className="card hover:shadow-xl transition-all duration-200 cursor-pointer border-2 border-transparent hover:border-purple-500"
            onClick={() => router.push('/become-verifier')}
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Become Verifier
              </h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Have expertise? Help verify achievements in your field and build reputation in the ecosystem.
            </p>
            <div className="text-purple-600 font-semibold text-sm flex items-center">
              Register now →
            </div>
          </div>

          <div
            className="card hover:shadow-xl transition-all duration-200 cursor-pointer border-2 border-transparent hover:border-green-500"
            onClick={() => router.push('/my-certificates')}
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🎓</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                My Certificates
              </h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              View and manage your NFT certificates. Share them with employers, schools, or on social media.
            </p>
            <div className="text-green-600 font-semibold text-sm flex items-center">
              View certificates →
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
