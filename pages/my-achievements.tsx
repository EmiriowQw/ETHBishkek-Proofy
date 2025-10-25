import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/router";
import Link from "next/link";
import toast from "react-hot-toast";
import ImageUpload from "../components/ImageUpload";

interface Achievement {
  id: string;
  title: string;
  description: string;
  category: string;
  specificData: any;
  status: "draft" | "submitted" | "verified" | "rejected";
  createdAt: Date;
  submittedAt?: Date;
  verifiedAt?: Date;
  rejectedAt?: Date;
  rejectionReason?: string;
  proofImage?: string | null;
  proofDescription?: string | null;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

const getCategoryGradient = (color: string) => {
  const gradients: Record<string, string> = {
    blue: 'from-blue-500 to-indigo-600',
    orange: 'from-orange-500 to-red-600',
    green: 'from-green-500 to-emerald-600',
    purple: 'from-purple-500 to-indigo-600',
    gray: 'from-gray-500 to-slate-600',
  };
  return gradients[color] || gradients.gray;
};

export default function MyAchievements() {
  const { address, isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [categories, setCategories] = useState<Record<string, Category>>({});
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Submit modal state
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [proofOfCompletion, setProofOfCompletion] = useState("");
  const [proofImage, setProofImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isConnected && address) {
      console.log("🔄 [MY ACHIEVEMENTS] Loading data for address:", address);
      loadCategories();
      loadAchievements();
    }
  }, [isConnected, address]);

  // Auto-refresh every 10 seconds if there are pending achievements
  useEffect(() => {
    if (!isConnected || !address) return;

    const hasPending = achievements.some(a => a.status === "submitted");
    
    if (hasPending) {
      console.log("⏰ [AUTO-REFRESH] Setting up auto-refresh (10s) - has pending achievements");
      const interval = setInterval(() => {
        console.log("🔄 [AUTO-REFRESH] Refreshing achievements...");
        loadAchievements();
      }, 10000); // 10 seconds

      return () => {
        console.log("⏹️ [AUTO-REFRESH] Clearing auto-refresh");
        clearInterval(interval);
      };
    }
  }, [isConnected, address, achievements]);

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

  const loadAchievements = async () => {
    setLoading(true);
    try {
      console.log("📥 [LOAD] Fetching achievements for:", address);
      const response = await fetch(`/api/achievements/my-achievements?address=${address}`);
      if (response.ok) {
        const data = await response.json();
        console.log("✅ [LOAD] Received achievements:", data.achievements?.length || 0);
        data.achievements?.forEach((a: Achievement) => {
          console.log(`   - ${a.title}: status = ${a.status}`);
        });
        setAchievements(data.achievements || []);
      }
    } catch (error) {
      console.error("Error loading achievements:", error);
      toast.error("Failed to load achievements");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitForVerification = async () => {
    if (!selectedAchievement) return;

    if (!proofOfCompletion.trim() || proofOfCompletion.trim().length < 50) {
      toast.error("Please provide proof of completion (minimum 50 characters)");
      return;
    }

    if (!proofImage) {
      toast.error("Please upload proof image");
      return;
    }

    setIsSubmitting(true);
    toast.loading("Submitting for verification...", { id: "submit" });

    try {
      const response = await fetch("/api/achievements/submit-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          achievementId: selectedAchievement.id,
          studentAddress: address,
          proofOfCompletion: proofOfCompletion.trim(),
          proofImage: proofImage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit");
      }

      toast.success("✅ Achievement submitted for verification!", { id: "submit" });
      
      setShowSubmitModal(false);
      setProofOfCompletion("");
      setProofImage(null);
      setSelectedAchievement(null);
      loadAchievements();
    } catch (error: any) {
      console.error("Error submitting:", error);
      toast.error(error.message || "Failed to submit", { id: "submit" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClaimCertificate = async (achievement: Achievement) => {
    toast.loading("Claiming your NFT certificate...", { id: "claim" });

    try {
      const response = await fetch("/api/certificates/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          achievementId: achievement.id,
          studentAddress: address,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to claim certificate");
      }

      toast.success("🎓 NFT Certificate claimed successfully!", { id: "claim" });
      toast.success(`Token ID: ${data.data.certificate.tokenId}`, {
        duration: 5000,
        icon: "🎫",
      });

      setTimeout(() => {
        router.push(`/my-certificates`);
      }, 1000);
    } catch (error: any) {
      console.error("Error claiming certificate:", error);
      toast.error(error.message || "Failed to claim certificate", { id: "claim" });
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      draft: { bg: "bg-gray-100", text: "text-gray-800", label: "📝 Draft" },
      submitted: { bg: "bg-yellow-100", text: "text-yellow-800", label: "⏳ Pending" },
      verified: { bg: "bg-green-100", text: "text-green-800", label: "✅ Verified" },
      rejected: { bg: "bg-red-100", text: "text-red-800", label: "❌ Rejected" },
    };
    const badge = badges[status as keyof typeof badges] || badges.draft;
    return (
      <span className={`${badge.bg} ${badge.text} px-3 py-1 rounded-full text-sm font-semibold`}>
        {badge.label}
      </span>
    );
  };

  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);

  if (!mounted) return null;

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Connect Your Wallet</h1>
          <p className="text-gray-600 mb-8">Connect your wallet to view your achievements</p>
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
            <Link href="/" className="text-gray-600 hover:text-primary-600">Dashboard</Link>
            <Link href="/my-certificates" className="text-gray-600 hover:text-primary-600">Certificates</Link>
            <Link href="/verification" className="text-gray-600 hover:text-primary-600">Verification</Link>
            <ConnectButton />
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">My Achievements</h2>
            <p className="text-gray-600">Manage your achievements across all categories</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                console.log("🔄 [MANUAL REFRESH] User clicked refresh");
                loadAchievements();
                toast.success("Refreshing achievements...", { duration: 1000 });
              }}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <span>🔄</span>
              <span>{loading ? "Loading..." : "Refresh"}</span>
            </button>
            <button
              onClick={() => router.push('/create-achievement')}
              className="btn-primary flex items-center space-x-2"
            >
              <span>➕</span>
              <span>Create Achievement</span>
            </button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Categories</option>
            {Object.values(categories).map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card animate-pulse h-64"></div>
            ))}
          </div>
        ) : filteredAchievements.length === 0 ? (
          <div className="card text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl">🎯</span>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">No Achievements Yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Create your first achievement and get verified to receive an NFT certificate!
            </p>
            <button onClick={() => router.push('/create-achievement')} className="btn-primary">
              Create Your First Achievement
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAchievements.map((achievement) => {
              const category = categories[achievement.category];
              const gradient = getCategoryGradient(category?.color || 'gray');
              
              return (
                <div key={achievement.id} className="card hover:shadow-xl transition-all duration-200">
                  <div className={`bg-gradient-to-br ${gradient} p-4 rounded-t-lg text-white -m-6 mb-4`}>
                    <div className="text-3xl mb-2">{category?.icon || '📌'}</div>
                    <div className="text-sm opacity-90">{category?.name || 'Custom'}</div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-900 flex-1 mr-2">
                        {achievement.title}
                      </h3>
                      {getStatusBadge(achievement.status)}
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {achievement.description}
                    </p>
                  </div>

                  {achievement.status === "draft" && (
                    <button
                      onClick={() => {
                        setSelectedAchievement(achievement);
                        setShowSubmitModal(true);
                      }}
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-all"
                    >
                      Submit for Verification →
                    </button>
                  )}

                  {achievement.status === "submitted" && (
                    <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                      <p className="text-yellow-900 font-semibold">Under Review</p>
                      <p className="text-yellow-700 text-sm">Your achievement is being verified</p>
                    </div>
                  )}

                  {achievement.status === "verified" && (
                    <button
                      onClick={() => handleClaimCertificate(achievement)}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition-all flex items-center justify-center space-x-2"
                    >
                      <span>🎓</span>
                      <span>Claim NFT Certificate</span>
                    </button>
                  )}

                  {achievement.status === "rejected" && (
                    <div className="space-y-3">
                      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                        <p className="text-red-900 font-semibold mb-1">Verification Rejected</p>
                        {achievement.rejectionReason && (
                          <p className="text-red-700 text-sm">{achievement.rejectionReason}</p>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          setSelectedAchievement(achievement);
                          setShowSubmitModal(true);
                        }}
                        className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-all"
                      >
                        📝 Review & Resubmit
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Submit Modal */}
      {showSubmitModal && selectedAchievement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Submit for Verification</h3>
                  <p className="text-gray-600 text-sm">Achievement: <span className="font-semibold">{selectedAchievement.title}</span></p>
                </div>
                <button
                  onClick={() => {
                    setShowSubmitModal(false);
                    setSelectedAchievement(null);
                    setProofOfCompletion("");
                    setProofImage(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Proof of Completion - Description *
                  </label>
                  <textarea
                    value={proofOfCompletion}
                    onChange={(e) => setProofOfCompletion(e.target.value)}
                    placeholder="Describe what you accomplished and provide evidence..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Minimum 50 characters required</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Proof of Completion - Image/Screenshot *
                  </label>
                  <ImageUpload onImageChange={setProofImage} maxSizeMB={5} />
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowSubmitModal(false);
                    setSelectedAchievement(null);
                    setProofOfCompletion("");
                    setProofImage(null);
                  }}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitForVerification}
                  disabled={isSubmitting || proofOfCompletion.trim().length < 50 || !proofImage}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Submitting..." : "Submit for Verification"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

