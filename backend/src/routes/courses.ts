import express from "express";
import { Request, Response } from "express";
import { Course } from "../models/Course";
import { UserProgress } from "../models/UserProgress";
import { authenticateUser } from "../middleware/auth";

const router = express.Router();

/**
 * @route   GET /api/courses
 * @desc    Get all courses
 * @access  Public
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const courses = await Course.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.json({
      success: true,
      data: courses,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch courses",
    });
  }
});

/**
 * @route   GET /api/courses/:id
 * @desc    Get course by ID
 * @access  Public
 */
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const course = await Course.findByPk(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        error: "Course not found",
      });
    }

    res.json({
      success: true,
      data: course,
    });
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch course",
    });
  }
});

/**
 * @route   GET /api/courses/:id/progress
 * @desc    Get user progress for a course
 * @access  Private
 */
router.get("/:id/progress", authenticateUser, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;

    const progress = await UserProgress.findOne({
      where: { userId, courseId: id },
    });

    res.json({
      success: true,
      data: progress || {
        userId,
        courseId: id,
        completedLessons: [],
        quizScores: {},
        totalProgress: 0,
        completed: false,
      },
    });
  } catch (error) {
    console.error("Error fetching progress:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch progress",
    });
  }
});

/**
 * @route   PUT /api/courses/:id/progress
 * @desc    Update user progress for a course
 * @access  Private
 */
router.put("/:id/progress", authenticateUser, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;
    const { completedLessons, quizScores, totalProgress, completed } = req.body;

    const [progress, created] = await UserProgress.upsert({
      userId,
      courseId: id,
      completedLessons: completedLessons || [],
      quizScores: quizScores || {},
      totalProgress: totalProgress || 0,
      completed: completed || false,
      completionDate: completed ? new Date() : null,
    });

    res.json({
      success: true,
      data: progress,
    });
  } catch (error) {
    console.error("Error updating progress:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update progress",
    });
  }
});

export default router;
