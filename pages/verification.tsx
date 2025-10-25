import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import toast from "react-hot-toast";

interface VerificationRequest {
  id: string;
  courseId: string;
  courseTitle: string;
  courseDescription: string;
  studentAddress: string;
  studentName?: string;
  lessonsCount: number;
  proofOfCompletion: string;
  submittedAt: Date;
  status: "pending" | "verified" | "rejected";
}

export default function Verification() {
  const { address, isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<VerificationRequest | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isConnected && address) {
      loadVerificationRequests();
    }
  }, [isConnected, address]);

  const loadVerificationRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/verification/requests");
      if (response.ok) {
        const data = await response.json();
        setRequests(data.requests || []);
      }
    } catch (error) {
      console.error("Error loading verification requests:", error);
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (request: VerificationRequest) => {
    setIsProcessing(true);
    toast.loading("Processing verification...", { id: "verify" });

    try {
      const response = await fetch("/api/verification/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestId: request.id,
          verifierAddress: address,
          status: "verified",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to verify");
      }

      toast.success("✅ Course verified! NFT certificate will be minted.", { id: "verify" });
      toast.success(`Student ${request.studentAddress.slice(0, 6)}...${request.studentAddress.slice(-4)} will receive their certificate`, {
        duration: 5000,
      });

      loadVerificationRequests();
      setSelectedRequest(null);
    } catch (error: any) {
      console.error("Error verifying:", error);
      toast.error(error.message || "Failed to verify course", { id: "verify" });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedRequest) return;

    if (!rejectionReason.trim() || rejectionReason.trim().length < 10) {
      toast.error("Please provide a detailed rejection reason (minimum 10 characters)");
      return;
    }

    setIsProcessing(true);
    toast.loading("Processing rejection...", { id: "reject" });

    try {
      const response = await fetch("/api/verification/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestId: selectedRequest.id,
          verifierAddress: address,
          status: "rejected",
          reason: rejectionReason.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to reject");
      }

      toast.success("Request rejected. Student has been notified.", { id: "reject" });
      
      setShowRejectModal(false);
      setRejectionReason("");
      loadVerificationRequests();
      setSelectedRequest(null);
    } catch (error: any) {
      console.error("Error rejecting:", error);
      toast.error(error.message || "Failed to reject request", { id: "reject" });
    } finally {
      setIsProcessing(false);
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
            Connect your wallet to access verification requests
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
          <h1 className="text-2xl font-bold text-primary-600">Proofy Admin</h1>
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

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-3xl font-bold text-gray-900">
              Verification Requests
            </h2>
            <span className="bg-primary-100 text-primary-700 px-4 py-2 rounded-full font-semibold">
              {requests.length} Pending
            </span>
          </div>
          <p className="text-gray-600">
            Review and verify course completion requests. Verified courses receive NFT certificates.
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : requests.length === 0 ? (
          <div className="card text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl">✅</span>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              All Caught Up!
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              There are no pending verification requests at the moment. Great job keeping up with verifications!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request.id} className="card hover:shadow-xl transition-all duration-200 border-2 border-transparent hover:border-primary-200">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-xl font-bold text-gray-900">
                        {request.courseTitle}
                      </h3>
                      <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                        ⏳ Pending Review
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4">
                      {request.courseDescription}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 bg-gray-50 p-3 rounded-lg">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Student</p>
                        <p className="text-sm font-mono text-gray-900">
                          {request.studentAddress.slice(0, 6)}...{request.studentAddress.slice(-4)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Lessons</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {request.lessonsCount} completed
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Submitted</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {new Date(request.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Days Pending</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {Math.floor((Date.now() - new Date(request.submittedAt).getTime()) / (1000 * 60 * 60 * 24))} days
                        </p>
                      </div>
                    </div>

                    {request.proofOfCompletion && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                        <p className="text-xs font-semibold text-blue-900 mb-1">
                          📝 Proof of Completion:
                        </p>
                        <p className="text-sm text-blue-800">
                          {request.proofOfCompletion}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    <button
                      onClick={() => setSelectedRequest(request)}
                      className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium py-2 px-4 rounded-lg transition-colors text-sm whitespace-nowrap"
                    >
                      👁️ Review Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Detail Modal */}
      {selectedRequest && !showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    Review Course Completion
                  </h3>
                  <p className="text-gray-600">
                    Carefully review all details before making a decision
                  </p>
                </div>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6 mb-6">
                <div className="bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200 rounded-lg p-4">
                  <h4 className="font-semibold text-primary-900 mb-2">Course Information</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-primary-700">Title:</span>
                      <p className="text-primary-900 font-semibold">{selectedRequest.courseTitle}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-primary-700">Description:</span>
                      <p className="text-primary-900">{selectedRequest.courseDescription}</p>
                    </div>
                    <div className="flex items-center space-x-4 pt-2">
                      <span className="text-sm">
                        <span className="font-medium text-primary-700">Lessons:</span>{" "}
                        <span className="text-primary-900 font-semibold">{selectedRequest.lessonsCount}</span>
                      </span>
                      <span className="text-sm">
                        <span className="font-medium text-primary-700">Course ID:</span>{" "}
                        <span className="text-primary-900 font-mono text-xs">{selectedRequest.courseId}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-900 mb-2">Student Information</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-purple-700">Wallet Address:</span>
                      <p className="text-purple-900 font-mono text-sm break-all">
                        {selectedRequest.studentAddress}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-purple-700">Submitted:</span>
                      <p className="text-purple-900">
                        {new Date(selectedRequest.submittedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {selectedRequest.proofOfCompletion && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-900 mb-2">📝 Proof of Completion</h4>
                    <p className="text-green-900 whitespace-pre-wrap">
                      {selectedRequest.proofOfCompletion}
                    </p>
                  </div>
                )}

                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
                  <h4 className="font-semibold text-amber-900 mb-2">⚡ What Happens Next?</h4>
                  <div className="space-y-1 text-sm">
                    <p className="text-amber-800">
                      <span className="font-semibold">✅ If Verified:</span> NFT certificate will be minted automatically (gasless)
                    </p>
                    <p className="text-amber-800">
                      <span className="font-semibold">❌ If Rejected:</span> Student will be notified with your feedback
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowRejectModal(true);
                  }}
                  disabled={isProcessing}
                  className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <span>❌</span>
                  <span>Reject Request</span>
                </button>
                <button
                  onClick={() => handleVerify(selectedRequest)}
                  disabled={isProcessing}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <span>✅</span>
                  <span>Verify & Issue Certificate</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-red-900 mb-1">
                    Reject Verification Request
                  </h3>
                  <p className="text-gray-600">
                    Provide detailed feedback to help the student improve
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectionReason("");
                  }}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Reason *
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Please provide specific feedback on why this course doesn't meet verification requirements. Be constructive and specific so the student can improve and resubmit..."
                  rows={6}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Minimum 10 characters required • Be specific and constructive
                </p>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-900 text-sm">
                  <span className="font-semibold">⚠️ Important:</span> The student will receive this feedback and can resubmit after making improvements.
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectionReason("");
                  }}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={isProcessing || rejectionReason.trim().length < 10}
                  className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-bold py-3 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? "Processing..." : "Confirm Rejection"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
