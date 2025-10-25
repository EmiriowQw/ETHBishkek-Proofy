import express from "express";
import { Request, Response } from "express";
import { User } from "../models/User";
import jwt from "jsonwebtoken";

const router = express.Router();

/**
 * @route   POST /api/auth/connect
 * @desc    Connect wallet and authenticate user
 * @access  Public
 */
router.post("/connect", async (req: Request, res: Response) => {
  try {
    const { walletAddress, signature, message } = req.body;

    if (!walletAddress || !signature || !message) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
      });
    }

    // Verify signature (simplified - in production, use proper signature verification)
    // For now, we'll just check if the wallet address is valid
    if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      return res.status(400).json({
        success: false,
        error: "Invalid wallet address",
      });
    }

    // Find or create user
    let user = await User.findOne({ where: { walletAddress } });
    
    if (!user) {
      user = await User.create({
        walletAddress,
        username: `User_${walletAddress.slice(0, 8)}`,
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, walletAddress },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          walletAddress: user.walletAddress,
          username: user.username,
          email: user.email,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Error connecting wallet:", error);
    res.status(500).json({
      success: false,
      error: "Failed to connect wallet",
    });
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current user
 * @access  Private
 */
router.get("/me", async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        walletAddress: user.walletAddress,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error("Error getting user:", error);
    res.status(401).json({
      success: false,
      error: "Invalid token",
    });
  }
});

export default router;
