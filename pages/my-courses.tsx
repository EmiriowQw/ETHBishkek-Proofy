import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/router";
import Link from "next/link";

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
}

export default function MyCourses() {
  const { address, isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
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
      // TODO: Call backend API to get user's courses
      const response = await fetch(`/api/courses/my-courses?address=${address}`);
      if (response.ok) {
        const data = await response.json();
        setCourses(data.courses || []);
      }
    } catch (error) {
      console.error("Error loading courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      draft: { bg: "bg-gray-100", text: "text-gray-800", label: "Draft" },
      submitted: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Pending Verification" },
      verified: { bg: "bg-green-100", text: "text-green-800", label: "Verified ✓" },
      rejected: { bg: "bg-red-100", text: "text-red-800", label: "Rejected" },
    };
    const badge = badges[status as keyof typeof badges] || badges.draft;
    return (
      <span className={`${badge.bg} ${badge.text} px-2 py-1 rounded text-xs font-medium`}>
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
              Manage your created courses
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
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📚</span>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              No Courses Yet
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              You haven't created any courses yet. Start by creating your first course!
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
              <div key={course.id} className="card hover:shadow-lg transition-shadow duration-200">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {course.title}
                    </h3>
                    {getStatusBadge(course.status)}
                  </div>
                  <p className="text-gray-600 text-sm mb-3">
                    {course.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>📚 {course.lessonsCount} lessons</span>
                    {course.duration && <span>⏱️ {course.duration}</span>}
                  </div>

                  {course.status === "draft" && (
                    <button
                      onClick={() => router.push(`/submit-course/${course.id}`)}
                      className="w-full btn-primary text-sm"
                    >
                      Submit for Verification
                    </button>
                  )}

                  {course.status === "submitted" && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-yellow-800 text-sm">
                        ⏳ Waiting for verification...
                      </p>
                    </div>
                  )}

                  {course.status === "verified" && (
                    <button
                      onClick={() => router.push(`/claim-certificate/${course.id}`)}
                      className="w-full btn-primary text-sm"
                    >
                      🎓 Claim NFT Certificate
                    </button>
                  )}

                  {course.status === "rejected" && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-red-800 text-sm">
                        ❌ Verification rejected. Please review and resubmit.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

