import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/router";
import Link from "next/link";
import toast from "react-hot-toast";
import ImageUpload from "../components/ImageUpload";

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  lessonsCount: number;
  status: "draft" | "submitted" | "verified" | "rejected";
  createdAt: Date;
  submittedAt?: Date;
  verifiedAt?: Date;
  rejectedAt?: Date;
  rejectionReason?: string;
}

export default function MyCourses() {
  const { address, isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [proofOfCompletion, setProofOfCompletion] = useState("");
  const [proofImage, setProofImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isConnected && address) {
      loadCourses();
    }
  }, [isConnected, address]);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/courses/my-courses?address=${address}`);
      if (response.ok) {
        const data = await response.json();
        setCourses(data.courses || []);
      }
    } catch (error) {
      console.error("Error loading courses:", error);
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitForVerification = async () => {
    if (!selectedCourse) return;

    if (!proofOfCompletion.trim() || proofOfCompletion.trim().length < 50) {
      toast.error("Please provide proof of completion (minimum 50 characters)");
      return;
    }

    if (!proofImage) {
      toast.error("Please upload proof image (screenshot, certificate, etc.)");
      return;
    }

    setIsSubmitting(true);
    toast.loading("Submitting for verification...", { id: "submit" });

    try {
      const response = await fetch("/api/courses/submit-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId: selectedCourse.id,
          studentAddress: address,
          proofOfCompletion: proofOfCompletion.trim(),
          proofImage: proofImage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit");
      }

      toast.success("✅ Course submitted for verification!", { id: "submit" });
      toast.success("You'll be notified when verification is complete", {
        duration: 5000,
      });

      setShowSubmitModal(false);
      setProofOfCompletion("");
      setProofImage(null);
      setSelectedCourse(null);
      loadCourses();
    } catch (error: any) {
      console.error("Error submitting:", error);
      toast.error(error.message || "Failed to submit", { id: "submit" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClaimCertificate = async (course: Course) => {
    toast.loading("Claiming your NFT certificate...", { id: "claim" });

    try {
      const response = await fetch("/api/certificates/claim", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId: course.id,
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
      draft: { bg: "bg-gray-100", text: "text-gray-800", label: "📝 Draft", icon: "📝" },
      submitted: { bg: "bg-yellow-100", text: "text-yellow-800", label: "⏳ Pending", icon: "⏳" },
      verified: { bg: "bg-green-100", text: "text-green-800", label: "✅ Verified", icon: "✅" },
      rejected: { bg: "bg-red-100", text: "text-red-800", label: "❌ Rejected", icon: "❌" },
    };
    const badge = badges[status as keyof typeof badges] || badges.draft;
    return (
      <span className={`${badge.bg} ${badge.text} px-3 py-1 rounded-full text-sm font-semibold`}>
        {badge.label}
      </span>
    );
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
            Connect your wallet to view your courses
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
            <Link href="/my-certificates" className="text-gray-600 hover:text-primary-600">
              My Certificates
            </Link>
            <Link href="/verification" className="text-gray-600 hover:text-primary-600">
              Verification
            </Link>
            <ConnectButton />
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              My Courses
            </h2>
            <p className="text-gray-600">
              Manage your created courses and track verification status
            </p>
          </div>
          <button
            onClick={() => router.push('/create-course')}
            className="btn-primary flex items-center space-x-2"
          >
            <span>➕</span>
            <span>Create New Course</span>
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="card text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl">📚</span>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              No Courses Yet
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              You haven't created any courses yet. Create your first course and get verified to receive an NFT certificate!
            </p>
            <button
              onClick={() => router.push('/create-course')}
              className="btn-primary"
            >
              Create Your First Course
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="card hover:shadow-xl transition-all duration-200 border-2 border-transparent hover:border-primary-200">
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900 flex-1 mr-2">
                      {course.title}
                    </h3>
                    {getStatusBadge(course.status)}
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4 pb-4 border-b border-gray-100">
                    <span className="flex items-center">
                      <span className="mr-1">📚</span>
                      {course.lessonsCount} lessons
                    </span>
                    {course.duration && (
                      <span className="flex items-center">
                        <span className="mr-1">⏱️</span>
                        {course.duration}
                      </span>
                    )}
                  </div>

                  {/* Draft Status */}
                  {course.status === "draft" && (
                    <div className="space-y-2">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                        <p className="text-blue-800 text-sm">
                          💡 Ready to get your certificate? Submit for verification!
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedCourse(course);
                          setShowSubmitModal(true);
                        }}
                        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200"
                      >
                        Submit for Verification →
                      </button>
                    </div>
                  )}

                  {/* Submitted Status */}
                  {course.status === "submitted" && (
                    <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <span className="text-2xl mr-2">⏳</span>
                        <div>
                          <p className="text-yellow-900 font-semibold">Under Review</p>
                          <p className="text-yellow-700 text-sm">
                            Your course is being verified by our team
                          </p>
                        </div>
                      </div>
                      {course.submittedAt && (
                        <p className="text-yellow-600 text-xs mt-2">
                          Submitted: {new Date(course.submittedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Verified Status */}
                  {course.status === "verified" && (
                    <div className="space-y-2">
                      <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-3">
                        <div className="flex items-center mb-2">
                          <span className="text-2xl mr-2">✅</span>
                          <div>
                            <p className="text-green-900 font-semibold">Verified!</p>
                            <p className="text-green-700 text-sm">
                              Your course has been approved
                            </p>
                          </div>
                        </div>
                        {course.verifiedAt && (
                          <p className="text-green-600 text-xs mt-2">
                            Verified: {new Date(course.verifiedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleClaimCertificate(course)}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                      >
                        <span>🎓</span>
                        <span>Claim NFT Certificate</span>
                      </button>
                    </div>
                  )}

                  {/* Rejected Status */}
                  {course.status === "rejected" && (
                    <div className="space-y-3">
                      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                        <div className="flex items-start mb-2">
                          <span className="text-2xl mr-2">❌</span>
                          <div className="flex-1">
                            <p className="text-red-900 font-semibold mb-1">Verification Rejected</p>
                            {course.rejectionReason && (
                              <p className="text-red-700 text-sm mb-2">
                                <span className="font-medium">Reason:</span> {course.rejectionReason}
                              </p>
                            )}
                            {course.rejectedAt && (
                              <p className="text-red-600 text-xs">
                                Rejected: {new Date(course.rejectedAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          toast("Please review the feedback and resubmit after making improvements", {
                            icon: "💡",
                          });
                          setSelectedCourse(course);
                          setShowSubmitModal(true);
                        }}
                        className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200"
                      >
                        📝 Review & Resubmit
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit for Verification Modal */}
      {showSubmitModal && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Submit for Verification
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Course: <span className="font-semibold">{selectedCourse.title}</span>
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowSubmitModal(false);
                    setSelectedCourse(null);
                    setProofOfCompletion("");
                    setProofImage(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-blue-900 mb-2">📋 Verification Process</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>✓ Admin will review your course content</li>
                  <li>✓ Verification usually takes 24-48 hours</li>
                  <li>✓ Upon approval, you'll receive an NFT certificate</li>
                  <li>✓ Certificate minting is gasless!</li>
                </ul>
              </div>

              <div className="space-y-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Proof of Completion - Description *
                  </label>
                  <textarea
                    value={proofOfCompletion}
                    onChange={(e) => setProofOfCompletion(e.target.value)}
                    placeholder="Describe what you learned and accomplished in this course. Include key concepts, projects completed, or skills gained..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Minimum 50 characters required
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Proof of Completion - Image/Screenshot *
                  </label>
                  <ImageUpload 
                    onImageChange={setProofImage}
                    maxSizeMB={5}
                  />
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-amber-900 text-sm font-medium mb-1">
                    ⚠️ Required for Verification:
                  </p>
                  <ul className="text-amber-800 text-xs space-y-1 ml-4">
                    <li>• Detailed description of your learning (min 50 chars)</li>
                    <li>• Visual proof (screenshot/certificate/project)</li>
                    <li>• Ensure all content is complete and accurate</li>
                  </ul>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowSubmitModal(false);
                    setSelectedCourse(null);
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
