import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import path from "path";

export interface IPFSUploadResult {
  hash: string;
  size: number;
  url: string;
}

export class IPFSService {
  private pinataApiKey: string;
  private pinataSecretKey: string;
  private gatewayUrl: string;

  constructor() {
    this.pinataApiKey = process.env.PINATA_API_KEY || "";
    this.pinataSecretKey = process.env.PINATA_SECRET_KEY || "";
    this.gatewayUrl = process.env.IPFS_GATEWAY || "https://gateway.pinata.cloud/ipfs/";
  }

  /**
   * Upload JSON metadata to IPFS
   */
  async uploadJSON(metadata: any): Promise<IPFSUploadResult> {
    try {
      const formData = new FormData();
      formData.append("file", JSON.stringify(metadata), {
        filename: "metadata.json",
        contentType: "application/json",
      });

      const pinataMetadata = {
        name: `Certificate Metadata - ${metadata.name}`,
        keyvalues: {
          type: "certificate-metadata",
          course: metadata.attributes.find((attr: any) => attr.trait_type === "Course")?.value || "",
        },
      };

      formData.append("pinataMetadata", JSON.stringify(pinataMetadata));

      const pinataOptions = {
        cidVersion: 1,
      };
      formData.append("pinataOptions", JSON.stringify(pinataOptions));

      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          headers: {
            "Content-Type": `multipart/form-data; boundary=${formData.getBoundary()}`,
            pinata_api_key: this.pinataApiKey,
            pinata_secret_api_key: this.pinataSecretKey,
          },
        }
      );

      return {
        hash: response.data.IpfsHash,
        size: response.data.PinSize,
        url: `${this.gatewayUrl}${response.data.IpfsHash}`,
      };
    } catch (error) {
      console.error("Error uploading to IPFS:", error);
      throw new Error("Failed to upload metadata to IPFS");
    }
  }

  /**
   * Upload image to IPFS
   */
  async uploadImage(imageBuffer: Buffer, filename: string): Promise<IPFSUploadResult> {
    try {
      const formData = new FormData();
      formData.append("file", imageBuffer, {
        filename,
        contentType: "image/png",
      });

      const pinataMetadata = {
        name: `Certificate Image - ${filename}`,
        keyvalues: {
          type: "certificate-image",
        },
      };

      formData.append("pinataMetadata", JSON.stringify(pinataMetadata));

      const pinataOptions = {
        cidVersion: 1,
      };
      formData.append("pinataOptions", JSON.stringify(pinataOptions));

      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          headers: {
            "Content-Type": `multipart/form-data; boundary=${formData.getBoundary()}`,
            pinata_api_key: this.pinataApiKey,
            pinata_secret_api_key: this.pinataSecretKey,
          },
        }
      );

      return {
        hash: response.data.IpfsHash,
        size: response.data.PinSize,
        url: `${this.gatewayUrl}${response.data.IpfsHash}`,
      };
    } catch (error) {
      console.error("Error uploading image to IPFS:", error);
      throw new Error("Failed to upload image to IPFS");
    }
  }

  /**
   * Generate certificate metadata JSON
   */
  generateCertificateMetadata(
    courseName: string,
    studentName: string,
    completionDate: Date,
    imageUrl: string,
    tokenId: string
  ) {
    return {
      name: `${courseName} - Certificate of Completion`,
      description: `This certificate verifies that ${studentName} has successfully completed the ${courseName} course.`,
      image: imageUrl,
      external_url: `${process.env.FRONTEND_URL}/certificate/${tokenId}`,
      attributes: [
        {
          trait_type: "Course",
          value: courseName,
        },
        {
          trait_type: "Student",
          value: studentName,
        },
        {
          trait_type: "Completion Date",
          value: completionDate.toISOString().split("T")[0],
        },
        {
          trait_type: "Certificate Type",
          value: "Course Completion",
        },
        {
          trait_type: "Verified",
          value: "Blockchain Verified",
        },
      ],
    };
  }
}

export const ipfsService = new IPFSService();
