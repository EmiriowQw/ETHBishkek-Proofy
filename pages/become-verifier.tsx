import { useState, useEffect, useCallback } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/router";
import Link from "next/link";
import toast from "react-hot-toast";

interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

export default function BecomeVerifier() {
  const { address, isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [verifierName, setVerifierName] = useState("");
  const [credentials, setCredentials] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAlreadyVerifier, setIsAlreadyVerifier] = useState(false);
  const [existingVerifierData, setExistingVerifierData] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isConnected && address) {
      loadCategories();
      checkVerifierStatus();
    }
  }, [isConnected, address]);

  const loadCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const checkVerifierStatus = useCallback(async () => {
    try {
      const response = await fetch(`/api/verifiers/my-role?address=${address}`);
      if (response.ok) {
        const data = await response.json();
        if (data.isVerifier) {
          setIsAlreadyVerifier(true);
          setExistingVerifierData(data.verifier);
          setVerifierName(data.verifier.name || '');
          setSelectedCategories(data.verifier.categories || []);
          setCredentials(data.verifier.credentials || '');
        }
      }
    } catch (error) {
      console.error("Error checking verifier status:", error);
    }
  }, [address]);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedCategories.length === 0) {
      toast.error("Please select at least one category to verify");
      return;
    }

    if (!verifierName.trim() || verifierName.trim().length < 3) {
      toast.error("Verifier name must be at least 3 characters");
      return;
    }

    if (!credentials.trim() || credentials.trim().length < 20) {
      toast.error("Please provide credentials (minimum 20 characters)");
      return;
    }

    setIsSubmitting(true);
    toast.loading(isAlreadyVerifier ? "Updating verifier profile..." : "Registering as verifier...", { id: "verifier-register" });

    try {
      const response = await fetch("/api/verifiers/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address,
          name: verifierName.trim(),
          categories: selectedCategories,
          credentials: credentials.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to register");
      }

      toast.success(
        isAlreadyVerifier 
          ? "✅ Verifier profile updated successfully!" 
          : "✅ Successfully registered as verifier!", 
        { id: "verifier-register" }
      );
      
      toast.success("You can now verify achievements in your categories!", {
        duration: 5000,
      });

      setTimeout(() => {
        router.push("/verification");
      }, 1500);
    } catch (error: any) {
      console.error("Error registering verifier:", error);
      toast.error(error.message || "Failed to register as verifier", { id: "verifier-register" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) {
    return null;
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-5xl">🛡️</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Connect Your Wallet
          </h1>
          <p className="text-gray-600 mb-8">
            Connect your wallet to become a verifier
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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl">🛡️</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-3">
              {isAlreadyVerifier ? "Update Verifier Profile" : "Become a Verifier"}
            </h2>
            <p className="text-xl text-gray-600">
              {isAlreadyVerifier 
                ? "Update your verifier profile and categories"
                : "Help verify achievements in your area of expertise"
              }
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center">
              <span className="mr-2">💡</span>
              What is a Verifier?
            </h3>
            <ul className="space-y-2 text-blue-800">
              <li className="flex items-start">
                <span className="mr-2">✅</span>
                <span>Review and approve achievement submissions in your category</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✅</span>
                <span>Ensure authenticity and quality of achievements</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✅</span>
                <span>Help issue NFT certificates for verified achievements</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✅</span>
                <span>Build reputation in the Proofy ecosystem</span>
              </li>
            </ul>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 space-y-8">
            {/* Step 1: Basic Info */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                1. Verifier Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="verifierName" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name / Organization *
                  </label>
                  <input
                    type="text"
                    id="verifierName"
                    value={verifierName}
                    onChange={(e) => setVerifierName(e.target.value)}
                    placeholder="e.g., John Doe, ABC Sports Federation"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                    minLength={3}
                  />
                </div>

                <div>
                  <label htmlFor="credentials" className="block text-sm font-medium text-gray-700 mb-1">
                    Credentials & Experience *
                  </label>
                  <textarea
                    id="credentials"
                    value={credentials}
                    onChange={(e) => setCredentials(e.target.value)}
                    placeholder="Describe your qualifications, experience, certifications, or expertise that makes you qualified to verify achievements in your selected categories..."
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                    minLength={20}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Minimum 20 characters. Be specific about your expertise.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2: Select Categories */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                2. Select Categories to Verify *
              </h3>
              <p className="text-gray-600 mb-4">
                Choose the categories where you have expertise to verify achievements
              </p>

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => toggleCategory(category.id)}
                      className={`relative flex items-center p-4 rounded-lg border-2 transition-all duration-200
                        ${selectedCategories.includes(category.id)
                          ? 'border-purple-500 bg-purple-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                        }
                      `}
                    >
                      {selectedCategories.includes(category.id) && (
                        <span className="absolute top-2 right-2 text-purple-600 text-lg">✅</span>
                      )}
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getCategoryColorClass(category.color)} flex items-center justify-center text-2xl mr-4 flex-shrink-0`}>
                        {category.icon}
                      </div>
                      <div className="text-left flex-1">
                        <h4 className="font-bold text-gray-900 mb-1">{category.name}</h4>
                        <p className="text-sm text-gray-600 line-clamp-2">{category.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {selectedCategories.length > 0 && (
                <div className="mt-4 bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <p className="text-purple-800 text-sm">
                    ✅ Selected {selectedCategories.length} {selectedCategories.length === 1 ? 'category' : 'categories'}
                  </p>
                </div>
              )}
            </div>

            {/* Requirements Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-bold text-yellow-900 mb-2 flex items-center">
                <span className="mr-2">⚠️</span>
                Verifier Responsibilities
              </h4>
              <ul className="space-y-1 text-sm text-yellow-800">
                <li>• Review submissions carefully and objectively</li>
                <li>• Verify proof of completion (images, documents, descriptions)</li>
                <li>• Approve only legitimate and authentic achievements</li>
                <li>• Provide clear rejection reasons if needed</li>
              </ul>
            </div>

            {/* Submit Button */}
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => router.push('/')}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || selectedCategories.length === 0 || verifierName.trim().length < 3 || credentials.trim().length < 20}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold py-3 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting 
                  ? (isAlreadyVerifier ? "Updating..." : "Registering...") 
                  : (isAlreadyVerifier ? "Update Profile" : "Become Verifier")
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

