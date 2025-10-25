import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import toast from "react-hot-toast";

export default function APIIntegration() {
  const { address, isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const generateApiKey = () => {
    // Generate mock API key
    const key = `pk_${address?.slice(2, 10)}_${Date.now().toString(36)}`;
    setApiKey(key);
    toast.success("API Key generated!");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
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
            Connect your wallet to access API integration
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
          <h1 className="text-2xl font-bold text-primary-600">Proofy</h1>
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-gray-600 hover:text-primary-600">
              Dashboard
            </Link>
            <Link href="/my-courses" className="text-gray-600 hover:text-primary-600">
              My Courses
            </Link>
            <Link href="/my-certificates" className="text-gray-600 hover:text-primary-600">
              My Certificates
            </Link>
            <ConnectButton />
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            API Integration
          </h2>
          <p className="text-gray-600">
            Integrate Proofy with your course platform for automatic NFT certificate minting
          </p>
        </div>

        {/* API Key Section */}
        <div className="card mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            🔑 API Key
          </h3>
          
          {!apiKey ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <p className="text-blue-800 mb-4">
                Generate your API key to start integrating with Proofy
              </p>
              <button onClick={generateApiKey} className="btn-primary">
                Generate API Key
              </button>
            </div>
          ) : (
            <div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <code className={`flex-1 font-mono text-sm ${showApiKey ? '' : 'blur-sm'}`}>
                    {apiKey}
                  </code>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      {showApiKey ? '👁️' : '👁️‍🗨️'}
                    </button>
                    <button
                      onClick={() => copyToClipboard(apiKey)}
                      className="text-primary-600 hover:text-primary-700"
                    >
                      📋 Copy
                    </button>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                ⚠️ Keep your API key secret! Don't share it or commit it to version control.
              </p>
            </div>
          )}
        </div>

        {/* Quick Start */}
        <div className="card mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            🚀 Quick Start
          </h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">1. API Endpoint</h4>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                POST https://api.proofy.io/v1/certificates/mint
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">2. Headers</h4>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                Content-Type: application/json<br/>
                Authorization: Bearer YOUR_API_KEY
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">3. Request Body</h4>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
{`{
  "studentAddress": "0x...",
  "courseName": "Web3 Development",
  "courseId": "web3-dev-101",
  "studentName": "John Doe",
  "completionDate": "2024-10-24"
}`}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">4. Response</h4>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
{`{
  "success": true,
  "tokenId": "1234",
  "tokenURI": "ipfs://...",
  "txHash": "0x...",
  "message": "Certificate minted successfully"
}`}
              </div>
            </div>
          </div>
        </div>

        {/* Code Examples */}
        <div className="card mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            💻 Code Examples
          </h3>

          <div className="space-y-4">
            {/* JavaScript */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900">JavaScript / Node.js</h4>
                <button 
                  onClick={() => copyToClipboard(`const response = await fetch('https://api.proofy.io/v1/certificates/mint', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    studentAddress: '0x...',
    courseName: 'Web3 Development',
    courseId: 'web3-dev-101',
    studentName: 'John Doe',
    completionDate: '2024-10-24'
  })
});

const data = await response.json();
console.log(data);`)}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  📋 Copy
                </button>
              </div>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
{`const response = await fetch('https://api.proofy.io/v1/certificates/mint', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    studentAddress: '0x...',
    courseName: 'Web3 Development',
    courseId: 'web3-dev-101',
    studentName: 'John Doe',
    completionDate: '2024-10-24'
  })
});

const data = await response.json();
console.log(data);`}
              </div>
            </div>

            {/* Python */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900">Python</h4>
                <button 
                  onClick={() => copyToClipboard(`import requests

response = requests.post(
    'https://api.proofy.io/v1/certificates/mint',
    headers={
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_API_KEY'
    },
    json={
        'studentAddress': '0x...',
        'courseName': 'Web3 Development',
        'courseId': 'web3-dev-101',
        'studentName': 'John Doe',
        'completionDate': '2024-10-24'
    }
)

data = response.json()
print(data)`)}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  📋 Copy
                </button>
              </div>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
{`import requests

response = requests.post(
    'https://api.proofy.io/v1/certificates/mint',
    headers={
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_API_KEY'
    },
    json={
        'studentAddress': '0x...',
        'courseName': 'Web3 Development',
        'courseId': 'web3-dev-101',
        'studentName': 'John Doe',
        'completionDate': '2024-10-24'
    }
)

data = response.json()
print(data)`}
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="card mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            ✨ Features
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">⛽</span>
              <div>
                <h4 className="font-semibold text-gray-900">Gasless Minting</h4>
                <p className="text-sm text-gray-600">Users don't pay gas fees - we cover it!</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <span className="text-2xl">⚡</span>
              <div>
                <h4 className="font-semibold text-gray-900">Instant Minting</h4>
                <p className="text-sm text-gray-600">NFT mints in seconds after completion</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <span className="text-2xl">🔗</span>
              <div>
                <h4 className="font-semibold text-gray-900">Blockchain Verified</h4>
                <p className="text-sm text-gray-600">Certificates on Status Network</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <span className="text-2xl">📊</span>
              <div>
                <h4 className="font-semibold text-gray-900">Analytics Dashboard</h4>
                <p className="text-sm text-gray-600">Track minted certificates</p>
              </div>
            </div>
          </div>
        </div>

        {/* Support */}
        <div className="card bg-gradient-to-r from-primary-50 to-blue-50">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            💬 Need Help?
          </h3>
          <p className="text-gray-600 mb-4">
            Our team is here to help you integrate Proofy with your platform.
          </p>
          <div className="flex space-x-4">
            <button className="btn-primary">
              📚 View Full Documentation
            </button>
            <button className="btn-secondary">
              💬 Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

