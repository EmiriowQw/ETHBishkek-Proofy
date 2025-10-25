import express from "express";
import { Request, Response } from "express";
import { Certificate } from "../models/Certificate";
import { User } from "../models/User";
import { Course } from "../models/Course";
import { UserProgress } from "../models/UserProgress";
import { ipfsService } from "../services/ipfsService";
import { blockchainService } from "../services/blockchainService";
import { authenticateUser } from "../middleware/auth";

const router = express.Router();

/**
 * @route   POST /api/certificates/mint
 * @desc    Mint a certificate NFT for completed course
 * @access  Private
 */
router.post("/mint", authenticateUser, async (req: Request, res: Response) => {
  try {
    const { courseId, courseName, studentName, studentAddress } = req.body;
    const userId = (req as any).user.id;

    // Validate input
    if (!courseId || !courseName || !studentName || !studentAddress) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
      });
    }

    // Check if user has completed the course
    const userProgress = await UserProgress.findOne({
      where: { userId, courseId, completed: true },
    });

    if (!userProgress) {
      return res.status(400).json({
        success: false,
        error: "Course not completed",
      });
    }

    // Check if certificate already exists
    const existingCertificate = await Certificate.findOne({
      where: { userId, courseId },
    });

    if (existingCertificate && existingCertificate.minted) {
      return res.status(400).json({
        success: false,
        error: "Certificate already minted for this course",
      });
    }

    // Generate certificate image (placeholder for now)
    const certificateImage = await generateCertificateImage(courseName, studentName);

    // Upload image to IPFS
    const imageResult = await ipfsService.uploadImage(
      certificateImage,
      `certificate-${courseId}-${userId}.png`
    );

    // Generate metadata
    const metadata = ipfsService.generateCertificateMetadata(
      courseName,
      studentName,
      new Date(),
      imageResult.url,
      "pending" // Will be updated after minting
    );

    // Upload metadata to IPFS
    const metadataResult = await ipfsService.uploadJSON(metadata);

    // Mint NFT using gasless transaction
    const mintResult = await blockchainService.mintCertificate(
      studentAddress,
      courseId,
      courseName,
      studentName,
      metadataResult.url
    );

    // Update or create certificate record
    const certificate = await Certificate.upsert({
      userId,
      courseId,
      studentName,
      courseName,
      tokenId: mintResult.tokenId,
      tokenURI: metadataResult.url,
      ipfsHash: metadataResult.hash,
      minted: true,
      mintedAt: new Date(),
    });

    res.json({
      success: true,
      data: {
        tokenId: mintResult.tokenId,
        tokenURI: metadataResult.url,
        txHash: mintResult.txHash,
        certificate: certificate[0],
      },
    });
  } catch (error) {
    console.error("Error minting certificate:", error);
    res.status(500).json({
      success: false,
      error: "Failed to mint certificate",
    });
  }
});

/**
 * @route   GET /api/certificates/user/:userId
 * @desc    Get all certificates for a user
 * @access  Private
 */
router.get("/user/:userId", authenticateUser, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const requestingUserId = (req as any).user.id;

    // Check if user is requesting their own certificates or is admin
    if (parseInt(userId) !== requestingUserId) {
      return res.status(403).json({
        success: false,
        error: "Access denied",
      });
    }

    const certificates = await Certificate.findAll({
      where: { userId: parseInt(userId), minted: true },
      include: [
        {
          model: Course,
          as: "course",
        },
      ],
    });

    res.json({
      success: true,
      data: certificates,
    });
  } catch (error) {
    console.error("Error fetching certificates:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch certificates",
    });
  }
});

/**
 * @route   GET /api/certificates/:tokenId
 * @desc    Get certificate by token ID
 * @access  Public
 */
router.get("/:tokenId", async (req: Request, res: Response) => {
  try {
    const { tokenId } = req.params;

    const certificate = await Certificate.findOne({
      where: { tokenId, minted: true },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["walletAddress", "username"],
        },
        {
          model: Course,
          as: "course",
        },
      ],
    });

    if (!certificate) {
      return res.status(404).json({
        success: false,
        error: "Certificate not found",
      });
    }

    res.json({
      success: true,
      data: certificate,
    });
  } catch (error) {
    console.error("Error fetching certificate:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch certificate",
    });
  }
});

/**
 * Generate certificate image (placeholder implementation)
 * In a real application, this would generate a proper certificate image
 */
async function generateCertificateImage(courseName: string, studentName: string): Promise<Buffer> {
  // This is a placeholder - in a real app, you'd use a library like Canvas or Sharp
  // to generate a proper certificate image
  const certificateData = {
    courseName,
    studentName,
    date: new Date().toISOString(),
  };

  // For now, return a simple JSON buffer
  // In production, generate an actual image
  return Buffer.from(JSON.stringify(certificateData));
}

export default router;
