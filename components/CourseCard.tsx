import { useState } from "react";
import { useAccount } from "wagmi";
import Link from "next/link";
import { Course } from "../types/course";
import { useCertificateNFT } from "../hooks/useCertificateNFT";

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  const { address } = useAccount();
  const { mintCertificate, isMinting } = useCertificateNFT();
  const [showMintModal, setShowMintModal] = useState(false);

  const handleMintCertificate = async () => {
    if (!address) return;
    
    try {
      await mintCertificate({
        courseId: course.id,
        courseName: course.title,
        studentName: "Student Name", // In real app, get from user profile
        studentAddress: address,
      });
      setShowMintModal(false);
    } catch (error) {
      console.error("Failed to mint certificate:", error);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "Advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <div className="card hover:shadow-lg transition-shadow duration-200">
        <div className="aspect-video bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg mb-4 flex items-center justify-center">
          <span className="text-4xl">📚</span>
        </div>
        
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-semibold text-gray-900">{course.title}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(course.difficulty)}`}>
              {course.difficulty}
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-3">{course.description}</p>
          
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <span>📅 {course.duration}</span>
            <span>📖 {course.lessons} lessons</span>
          </div>
          
          {course.completed ? (
            <div className="space-y-2">
              <div className="flex items-center text-green-600 text-sm font-medium">
                <span className="mr-2">✅</span>
                Course Completed!
              </div>
              <button
                onClick={() => setShowMintModal(true)}
                disabled={isMinting}
                className="w-full btn-primary disabled:opacity-50"
              >
                {isMinting ? "Minting..." : "🎓 Get NFT Certificate"}
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Progress: {course.progress}%</span>
                <span>{course.progress === 100 ? "Ready for certificate!" : "In Progress"}</span>
              </div>
              <Link href={`/course/${course.id}`} className="w-full btn-primary block text-center">
                {course.progress === 0 ? "Start Course" : "Continue Course"}
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mint Certificate Modal */}
      {showMintModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">Mint NFT Certificate</h3>
            <p className="text-gray-600 mb-6">
              You're about to mint a gasless NFT certificate for completing "{course.title}".
              This transaction will be completely free for you!
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center text-green-800">
                <span className="mr-2">⛽</span>
                <span className="font-medium">Gasless Transaction</span>
              </div>
              <p className="text-green-700 text-sm mt-1">
                No gas fees required - we cover all transaction costs
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowMintModal(false)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleMintCertificate}
                disabled={isMinting}
                className="flex-1 btn-primary disabled:opacity-50"
              >
                {isMinting ? "Minting..." : "Mint Certificate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
