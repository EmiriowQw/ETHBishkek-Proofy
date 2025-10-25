import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

export default function CoursePage() {
  const router = useRouter();
  const { id } = router.query;
  const { isConnected } = useAccount();
  const [progress, setProgress] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
            Connect your wallet to access this course
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
          <h1 className="text-2xl font-bold text-primary-600">Proofy NFT</h1>
          <div className="flex items-center space-x-4">
            <a href="/" className="text-gray-600 hover:text-primary-600">
              Courses
            </a>
            <a href="/my-certificates" className="text-gray-600 hover:text-primary-600">
              My Certificates
            </a>
            <ConnectButton />
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <button
              onClick={() => router.push("/")}
              className="text-primary-600 hover:text-primary-700 flex items-center"
            >
              ← Back to Courses
            </button>
          </div>

          <div className="card mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Course: {id}
            </h1>
            <p className="text-gray-600 mb-6">
              This is a demo course page. In a full implementation, this would show
              course lessons, quizzes, and track your progress.
            </p>

            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Course Progress
                </span>
                <span className="text-sm font-medium text-gray-700">
                  {progress}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800 text-sm">
                💡 Complete the course to earn your NFT certificate with no gas fees!
              </p>
            </div>

            <button
              onClick={() => {
                const newProgress = Math.min(progress + 20, 100);
                setProgress(newProgress);
                if (newProgress === 100) {
                  alert("Congratulations! You can now claim your NFT certificate!");
                }
              }}
              className="btn-primary"
            >
              {progress === 100 ? "Course Completed! ✅" : "Continue Learning"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


