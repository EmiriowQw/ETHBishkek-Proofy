import { useState } from "react";
import { Certificate } from "../types/certificate";

interface CertificateCardProps {
  certificate: Certificate;
}

export default function CertificateCard({ certificate }: CertificateCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <div className="aspect-video bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg mb-4 flex items-center justify-center relative">
        <span className="text-4xl">🏆</span>
        <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
          NFT
        </div>
      </div>
      
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {certificate.courseName}
        </h3>
        <p className="text-gray-600 text-sm mb-3">
          Certificate of Completion
        </p>
        
        <div className="space-y-2 text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <span className="mr-2">👤</span>
            <span>{certificate.studentName}</span>
          </div>
          <div className="flex items-center">
            <span className="mr-2">📅</span>
            <span>Completed on {formatDate(certificate.completionDate)}</span>
          </div>
          <div className="flex items-center">
            <span className="mr-2">🆔</span>
            <span className="font-mono text-xs">Token #{certificate.tokenId}</span>
          </div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
          <div className="flex items-center text-green-800 text-sm">
            <span className="mr-2">✅</span>
            <span className="font-medium">Blockchain Verified</span>
          </div>
          <p className="text-green-700 text-xs mt-1">
            This certificate is permanently recorded on the blockchain
          </p>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex-1 btn-secondary text-sm"
          >
            {showDetails ? "Hide Details" : "View Details"}
          </button>
          <button
            onClick={() => window.open(`https://sepolia.status.im/address/${certificate.tokenId}`, '_blank')}
            className="flex-1 btn-primary text-sm"
          >
            View on Explorer
          </button>
        </div>
        
        {showDetails && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Certificate Details</h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-gray-700">Course ID:</span>
                <span className="ml-2 font-mono text-gray-600">{certificate.courseId}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Token ID:</span>
                <span className="ml-2 font-mono text-gray-600">{certificate.tokenId}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Completion Date:</span>
                <span className="ml-2 text-gray-600">{certificate.completionDate.toISOString()}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Metadata URI:</span>
                <span className="ml-2 font-mono text-gray-600 text-xs break-all">
                  {certificate.tokenURI}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
