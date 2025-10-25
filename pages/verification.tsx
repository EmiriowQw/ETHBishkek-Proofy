import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import toast from "react-hot-toast";

interface VerificationRequest {
  id: string;
  courseId: string;
  courseTitle: string;
  studentAddress: string;
  studentName: string;
  lessonsCount: number;
  submittedAt: Date;
  status: "pending" | "verified" | "rejected";
}

export default function Verification() {
  const { address, isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<VerificationRequest | null>(null);

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
      // TODO: Call backend API to get verification requests
      const response = await fetch("/api/verification/requests");
      if (response.ok) {
        const data = await response.json();
        setRequests(data.requests || []);
      }
    } catch (error) {
      console.error("Error loading verification requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (requestId: string) => {
    toast.loading("Verifying...", { id: "verify" });
    try {
      const response = await fetch("/api/verification/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestId,
          verifierAddress: address,
          status: "verified",
        }),
      });

      if (response.ok) {
        toast.success("Course verified! NFT certificate will be minted.", { id: "verify" });
        loadVerificationRequests();
        setSelectedRequest(null);
      } else {
        throw new Error("Failed to verify");
      }
    } catch (error) {
      console.error("Error verifying:", error);
      toast.error("Failed to verify course", { id: "verify" });
    }
  };

  const handleReject = async (requestId: string, reason: string) => {
    toast.loading("Rejecting...", { id: "reject" });
    try {
      const response = await fetch("/api/verification/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestId,
          verifierAddress: address,
          status: "rejected",
          reason,
        }),
      });

      if (response.ok) {
        toast.success("Request rejected", { id: "reject" });
        loadVerificationRequests();
        setSelectedRequest(null);
      } else {
        throw new Error("Failed to reject");
      }
    } catch (error) {
      console.error("Error rejecting:", error);
      toast.error("Failed to reject request", { id: "reject" });
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

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Verification Requests
          </h2>
          <p className="text-gray-600">
            Review and verify course completion requests
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
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📋</span>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              No Verification Requests
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              There are no pending verification requests at the moment.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request.id} className="card hover:shadow-lg transition-shadow duration-200">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {request.courseTitle}
                      </h3>
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">
                        Pending
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">Student:</span>
                        <span className="font-mono">{request.studentAddress.slice(0, 6)}...{request.studentAddress.slice(-4)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">Lessons:</span>
                        <span>{request.lessonsCount} completed</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">Submitted:</span>
                        <span>{new Date(request.submittedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedRequest(request)}
                      className="btn-secondary text-sm"
                    >
                      Review
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Review Modal */}
        {selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Review Course Completion
                  </h3>
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Course Title
                    </label>
                    <p className="text-gray-900">{selectedRequest.courseTitle}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Student Address
                    </label>
                    <p className="text-gray-900 font-mono text-sm">
                      {selectedRequest.studentAddress}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lessons Completed
                    </label>
                    <p className="text-gray-900">{selectedRequest.lessonsCount} lessons</p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 text-sm">
                      💡 Review the course content and student's work. If everything looks good, verify to issue an NFT certificate.
                    </p>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => handleReject(selectedRequest.id, "Does not meet requirements")}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg"
                  >
                    ❌ Reject
                  </button>
                  <button
                    onClick={() => handleVerify(selectedRequest.id)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg"
                  >
                    ✅ Verify & Issue Certificate
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

