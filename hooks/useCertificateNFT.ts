import { useState } from "react";
import { useAccount } from "wagmi";
import toast from "react-hot-toast";

interface MintCertificateParams {
  courseId: string;
  courseName: string;
  studentName: string;
  studentAddress: string;
}

export function useCertificateNFT() {
  const { address, isConnected } = useAccount();
  const [isMinting, setIsMinting] = useState(false);

  const mintCertificate = async (params: MintCertificateParams) => {
    if (!address || !isConnected) {
      toast.error("Please connect your wallet");
      return;
    }

    setIsMinting(true);
    toast.loading("Minting certificate...", { id: "mint" });

    try {
      // Call backend API to handle gasless minting
      const response = await fetch("/api/mint-certificate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId: params.courseId,
          courseName: params.courseName,
          studentName: params.studentName,
          studentAddress: params.studentAddress,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to mint certificate");
      }

      const result = await response.json();
      
      toast.success("Certificate minted successfully! 🎉", { id: "mint" });
      
      // Refresh page to show new certificate
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
      return result;
    } catch (error: any) {
      console.error("Mint error:", error);
      toast.error(error.message || "Failed to mint certificate", { id: "mint" });
      throw error;
    } finally {
      setIsMinting(false);
    }
  };

  const getUserCertificates = async () => {
    if (!address) return [];

    try {
      // Call backend API to get user certificates
      const response = await fetch(`/api/certificates/user/${address}`);
      if (!response.ok) return [];
      
      const data = await response.json();
      return data.certificates || [];
    } catch (error) {
      console.error("Error fetching certificates:", error);
      return [];
    }
  };

  const getCertificateData = async (tokenId: string) => {
    try {
      const response = await fetch(`/api/certificates/${tokenId}`);
      if (!response.ok) return null;
      
      const data = await response.json();
      return data.certificate || null;
    } catch (error) {
      console.error("Error fetching certificate data:", error);
      return null;
    }
  };

  const hasCertificateForCourse = async (courseId: string) => {
    if (!address) return false;

    try {
      const certificates = await getUserCertificates();
      return certificates.some((cert: any) => cert.courseId === courseId);
    } catch (error) {
      console.error("Error checking certificate:", error);
      return false;
    }
  };

  return {
    mintCertificate,
    getUserCertificates,
    getCertificateData,
    hasCertificateForCourse,
    isMinting,
  };
}
