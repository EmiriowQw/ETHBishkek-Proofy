import express from "express";
import { Request, Response } from "express";
import { User } from "../models/User";
import { UserProgress } from "../models/UserProgress";
import { Certificate } from "../models/Certificate";
import { authenticateUser } from "../middleware/auth";

const router = express.Router();

/**
 * @route   GET /api/users/:id/profile
 * @desc    Get user profile
 * @access  Private
 */
router.get("/:id/profile", authenticateUser, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const requestingUserId = (req as any).user.id;

    // Check if user is requesting their own profile or is admin
    if (parseInt(id) !== requestingUserId) {
      return res.status(403).json({
        success: false,
        error: "Access denied",
      });
    }

    const user = await User.findByPk(id, {
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Get user's progress and certificates
    const progress = await UserProgress.findAll({
      where: { userId: id },
    });

    const certificates = await Certificate.findAll({
      where: { userId: id, minted: true },
    });

    res.json({
      success: true,
      data: {
        user,
        progress,
        certificates,
        stats: {
          totalCourses: progress.length,
          completedCourses: progress.filter(p => p.completed).length,
          certificatesEarned: certificates.length,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch user profile",
    });
  }
});

/**
 * @route   PUT /api/users/:id/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put("/:id/profile", authenticateUser, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const requestingUserId = (req as any).user.id;

    // Check if user is updating their own profile
    if (parseInt(id) !== requestingUserId) {
      return res.status(403).json({
        success: false,
        error: "Access denied",
      });
    }

    const { username, email, profileImage } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Update user profile
    await user.update({
      username: username || user.username,
      email: email || user.email,
      profileImage: profileImage || user.profileImage,
    });

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
    console.error("Error updating user profile:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update user profile",
    });
  }
});

export default router;
