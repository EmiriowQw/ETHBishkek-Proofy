import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true,
}));
app.use(morgan("combined"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Mock data storage
const mockCourses: any[] = [];
const mockVerificationRequests: any[] = [];

// API Routes for Courses
app.post("/api/courses/create", (req, res) => {
  try {
    const { title, description, duration, lessons, creatorAddress } = req.body;
    
    const newCourse = {
      id: `course-${Date.now()}`,
      title,
      description,
      duration: duration || "Not specified",
      lessons: lessons,
      lessonsCount: lessons.length,
      creatorAddress,
      status: "draft",
      createdAt: new Date().toISOString(),
    };

    mockCourses.push(newCourse);

    res.json({
      success: true,
      data: { course: newCourse },
      message: "Course created successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to create course",
    });
  }
});

app.get("/api/courses/my-courses", (req, res) => {
  const { address } = req.query;
  
  if (!address) {
    return res.status(400).json({
      success: false,
      error: "Address is required",
    });
  }

  const userCourses = mockCourses.filter(
    c => c.creatorAddress.toLowerCase() === (address as string).toLowerCase()
  );

  res.json({
    success: true,
    courses: userCourses,
  });
});

app.get("/api/courses/:id", (req, res) => {
  const course = mockCourses.find(c => c.id === req.params.id);
  if (!course) {
    return res.status(404).json({ success: false, error: "Course not found" });
  }
  res.json({ success: true, data: course });
});

// API v1 - External Integration (for course platforms)
app.post("/v1/certificates/mint", async (req, res) => {
  try {
    // Check API key
    const apiKey = req.headers.authorization?.replace("Bearer ", "");
    if (!apiKey || !apiKey.startsWith("pk_")) {
      return res.status(401).json({
        success: false,
        error: "Invalid API key",
      });
    }

    const { studentAddress, courseName, courseId, studentName, completionDate } = req.body;

    if (!studentAddress || !courseName || !courseId) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: studentAddress, courseName, courseId",
      });
    }

    // Mock NFT minting (gasless!)
    const tokenId = Math.floor(Math.random() * 10000).toString();
    const tokenURI = `https://ipfs.io/ipfs/mock-${tokenId}`;
    const txHash = `0x${Math.random().toString(16).substr(2, 64)}`;

    // Simulate async minting
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log(`✅ API Mint: ${courseName} for ${studentAddress}`);

    res.json({
      success: true,
      tokenId,
      tokenURI,
      txHash,
      message: "Certificate minted successfully via API (gasless!)",
      gasless: true,
      network: "Status Sepolia",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to mint certificate",
    });
  }
});

// Internal API - Manual submission
app.post("/api/certificates/mint", async (req, res) => {
  try {
    const { courseId, courseName, studentName, studentAddress } = req.body;

    // Mock minting process
    const tokenId = Math.floor(Math.random() * 10000).toString();
    const tokenURI = `https://ipfs.io/ipfs/mock-${tokenId}`;
    const txHash = `0x${Math.random().toString(16).substr(2, 64)}`;

    // Simulate async minting
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log(`✅ Manual Mint: ${courseName} for ${studentAddress}`);

    res.json({
      success: true,
      data: {
        tokenId,
        tokenURI,
        txHash,
        message: "Certificate minted successfully (demo mode)",
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to mint certificate",
    });
  }
});

app.get("/api/certificates/user/:userId", (req, res) => {
  // Mock certificates
  res.json({
    success: true,
    data: [],
  });
});

// API Routes for Verification
app.post("/api/courses/submit", (req, res) => {
  try {
    const { courseId, studentAddress } = req.body;
    
    const course = mockCourses.find(c => c.id === courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        error: "Course not found",
      });
    }

    // Update course status
    course.status = "submitted";
    course.submittedAt = new Date().toISOString();

    // Create verification request
    const verificationRequest = {
      id: `verify-${Date.now()}`,
      courseId,
      courseTitle: course.title,
      studentAddress,
      studentName: studentAddress.slice(0, 6) + "..." + studentAddress.slice(-4),
      lessonsCount: course.lessonsCount,
      submittedAt: new Date().toISOString(),
      status: "pending",
    };

    mockVerificationRequests.push(verificationRequest);

    res.json({
      success: true,
      message: "Course submitted for verification",
      data: { verificationRequest },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to submit course",
    });
  }
});

app.get("/api/verification/requests", (req, res) => {
  const pendingRequests = mockVerificationRequests.filter(r => r.status === "pending");
  
  res.json({
    success: true,
    requests: pendingRequests,
  });
});

app.post("/api/verification/verify", async (req, res) => {
  try {
    const { requestId, verifierAddress, status, reason } = req.body;
    
    const request = mockVerificationRequests.find(r => r.id === requestId);
    if (!request) {
      return res.status(404).json({
        success: false,
        error: "Verification request not found",
      });
    }

    // Update request status
    request.status = status;
    request.verifierAddress = verifierAddress;
    request.verifiedAt = new Date().toISOString();
    if (reason) {
      request.rejectionReason = reason;
    }

    // Update course status
    const course = mockCourses.find(c => c.id === request.courseId);
    if (course) {
      course.status = status;
      if (status === "verified") {
        course.verifiedAt = new Date().toISOString();
      }
    }

    // If verified, mint NFT certificate
    if (status === "verified") {
      // Simulate NFT minting
      const tokenId = Math.floor(Math.random() * 10000).toString();
      const tokenURI = `https://ipfs.io/ipfs/mock-${tokenId}`;
      const txHash = `0x${Math.random().toString(16).substr(2, 64)}`;

      res.json({
        success: true,
        message: "Course verified and NFT certificate minted",
        data: {
          status: "verified",
          tokenId,
          tokenURI,
          txHash,
        },
      });
    } else {
      res.json({
        success: true,
        message: "Verification request processed",
        data: {
          status,
          reason,
        },
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to process verification",
    });
  }
});

// Error handling
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || "Server Error",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 API: http://localhost:${PORT}/api`);
  console.log(`🏥 Health: http://localhost:${PORT}/health`);
  console.log(`⚠️  Running in DEMO mode (no database)`);
});

export default app;


