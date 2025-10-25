import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/router";
import Link from "next/link";
import toast from "react-hot-toast";
import CategorySelector from "../components/CategorySelector";
import EducationFields from "../components/categories/EducationFields";
import SportsFields from "../components/categories/SportsFields";
import VolunteeringFields from "../components/categories/VolunteeringFields";
import SkillsFields from "../components/categories/SkillsFields";
import CustomFields from "../components/categories/CustomFields";

interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  fields: string[];
  isCustom?: boolean;
}

export default function CreateAchievement() {
  const { address, isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Form state
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [specificData, setSpecificData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const renderCategoryFields = () => {
    if (!selectedCategory) return null;

    const props = {
      data: specificData,
      onChange: setSpecificData,
    };

    switch (selectedCategory.id) {
      case 'education':
        return <EducationFields {...props} />;
      case 'sports':
        return <SportsFields {...props} />;
      case 'volunteering':
        return <VolunteeringFields {...props} />;
      case 'skills':
        return <SkillsFields {...props} />;
      default:
        // Custom category
        return (
          <CustomFields
            fields={selectedCategory.fields}
            data={specificData}
            onChange={setSpecificData}
          />
        );
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!selectedCategory) {
      toast.error("Please select a category");
      return;
    }

    if (!title || title.trim().length < 5) {
      toast.error("Title must be at least 5 characters");
      return;
    }

    if (!description || description.trim().length < 20) {
      toast.error("Description must be at least 20 characters");
      return;
    }

    // Validate category-specific fields
    const requiredFields = selectedCategory.fields;
    const missingFields = requiredFields.filter(field => !specificData[field]);
    
    if (missingFields.length > 0) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!address) {
      toast.error("Please connect your wallet first!");
      return;
    }

    setIsSubmitting(true);
    toast.loading("Creating achievement...", { id: "create" });

    try {
      const response = await fetch("/api/achievements/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          category: selectedCategory.id,
          specificData,
          creatorAddress: address,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create achievement");
      }

      toast.success("Achievement created successfully!", { id: "create" });
      toast.success("Navigate to My Achievements to submit for verification", {
        duration: 4000,
      });

      // Redirect to my achievements
      setTimeout(() => {
        router.push("/my-achievements");
      }, 1500);
    } catch (error: any) {
      console.error("Error creating achievement:", error);
      toast.error(error.message || "Failed to create achievement", { id: "create" });
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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Connect Your Wallet
          </h1>
          <p className="text-gray-600 mb-8">
            Connect your wallet to create achievements
          </p>
          <ConnectButton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary-600">Proofy</h1>
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-gray-600 hover:text-primary-600">
              Dashboard
            </Link>
            <Link href="/my-achievements" className="text-gray-600 hover:text-primary-600">
              My Achievements
            </Link>
            <Link href="/my-certificates" className="text-gray-600 hover:text-primary-600">
              Certificates
            </Link>
            <ConnectButton />
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Create Achievement
          </h2>
          <p className="text-gray-600">
            Prove anything - from education and sports to volunteering and professional skills
          </p>
        </div>

        {/* Step 1: Category Selection */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Step 1: Select Category
          </h3>
          <CategorySelector
            selected={selectedCategory}
            onSelect={(category) => {
              setSelectedCategory(category);
              setSpecificData({});
            }}
          />
        </div>

        {/* Step 2: General Information */}
        {selectedCategory && (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Step 2: General Information
            </h3>
            <div className="card space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Achievement Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Bachelor's Degree in Computer Science, Marathon 2025"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Minimum 5 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your achievement in detail..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Minimum 20 characters</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Category-Specific Fields */}
        {selectedCategory && (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Step 3: {selectedCategory.name} Details
            </h3>
            <div className="card">
              {renderCategoryFields()}
            </div>
          </div>
        )}

        {/* Info Box */}
        {selectedCategory && (
          <div className="mb-8">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
              <h4 className="font-semibold text-blue-900 mb-3">📋 Next Steps</h4>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>✓ After creating, you can submit for verification from "My Achievements"</li>
                <li>✓ Upload proof (photo/screenshot) when submitting</li>
                <li>✓ Category verifier will review your submission</li>
                <li>✓ Upon approval, receive NFT certificate automatically</li>
              </ul>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {selectedCategory && (
          <div className="flex gap-4">
            <button
              onClick={() => router.back()}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating..." : "Create Achievement"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

