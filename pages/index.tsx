import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Home() {
  const { address, isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Welcome to Proofy
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Universal NFT certificate platform for course completion verification.
              Two ways to get your certificate - choose what works for you!
            </p>
            <div className="flex justify-center mb-12">
              <ConnectButton />
            </div>

            {/* Two Scenarios */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
              <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-primary-200">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🔗</span>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">External Integration</h3>
                <p className="text-gray-600 mb-6">
                  For course platforms: Integrate with our API. Users complete courses on your site 
                  and get NFT certificates automatically via our smart contract.
                </p>
                <div className="bg-blue-50 rounded-lg p-4 text-left">
                  <p className="text-sm font-semibold text-blue-900 mb-2">How it works:</p>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>✓ User completes course on your platform</li>
                    <li>✓ Your backend calls our API</li>
                    <li>✓ NFT mints automatically (gasless!)</li>
                    <li>✓ No manual verification needed</li>
                  </ul>
                </div>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-green-200">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">✍️</span>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">Manual Verification</h3>
                <p className="text-gray-600 mb-6">
                  For individuals: Create your course on our platform, submit for verification,
                  and receive your NFT certificate after admin approval.
                </p>
                <div className="bg-green-50 rounded-lg p-4 text-left">
                  <p className="text-sm font-semibold text-green-900 mb-2">How it works:</p>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>✓ Create course on our platform</li>
                    <li>✓ Submit for verification</li>
                    <li>✓ Admin reviews and approves</li>
                    <li>✓ NFT mints after approval</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⛽</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Gasless Transactions</h3>
                <p className="text-gray-600">
                  No gas fees - we cover all blockchain transaction costs
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔗</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Blockchain Verified</h3>
                <p className="text-gray-600">
                  Your achievements are permanently recorded on Status Network
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🚀</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Easy Integration</h3>
                <p className="text-gray-600">
                  Simple API for course platforms or manual creation
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
            <Link href="/english-demo" className="text-gray-600 hover:text-primary-600 font-semibold">
              📚 English Demo
            </Link>
            <Link href="/my-courses" className="text-gray-600 hover:text-primary-600">
              My Courses
            </Link>
            <Link href="/my-certificates" className="text-gray-600 hover:text-primary-600">
              My Certificates
            </Link>
            <Link href="/verification" className="text-gray-600 hover:text-primary-600">
              Verification
            </Link>
            <Link href="/api-integration" className="text-gray-600 hover:text-primary-600">
              API Integration
            </Link>
            <ConnectButton />
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard
          </h2>
          <p className="text-gray-600">
            Choose how you want to get your NFT certificates
          </p>
        </div>

        {/* Two Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="card hover:shadow-xl transition-all duration-200 cursor-pointer border-2 border-transparent hover:border-primary-500"
               onClick={() => router.push('/api-integration')}>
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🔗</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  API Integration
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  For course platforms: Integrate our API to automatically mint NFT certificates 
                  when users complete courses on your platform.
                </p>
                <button className="btn-primary text-sm">
                  View API Docs →
                </button>
              </div>
            </div>
          </div>

          <div className="card hover:shadow-xl transition-all duration-200 cursor-pointer border-2 border-transparent hover:border-green-500"
               onClick={() => router.push('/create-course')}>
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">✍️</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Manual Creation & Verification
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Create your course here, submit for verification, and receive 
                  your NFT certificate after admin approval.
                </p>
                <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg text-sm">
                  Create Course →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">My Courses</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">📚</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Pending Verification</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">⏳</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Verified</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">NFT Certificates</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🎓</span>
              </div>
            </div>
          </div>
        </div>

        {/* Getting Started */}
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            🚀 Getting Started
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">For Course Platforms:</h4>
              <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
                <li>Get your API key from <Link href="/api-integration" className="text-primary-600 hover:underline">API Integration</Link></li>
                <li>Integrate our endpoint to your course completion flow</li>
                <li>Send completion data to our API</li>
                <li>NFT automatically mints for the user (gasless!)</li>
              </ol>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">For Individual Users:</h4>
              <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
                <li><Link href="/create-course" className="text-primary-600 hover:underline">Create your course</Link> with lessons and content</li>
                <li>Submit for verification from "My Courses"</li>
                <li>Wait for admin approval (usually 24-48h)</li>
                <li>Claim your NFT certificate once approved!</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
