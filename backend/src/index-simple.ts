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
const mockCertificates: any[] = [];

// API Routes for Courses
app.post("/api/courses/create", (req, res) => {
  try {
    const { title, description, duration, lessons, creatorAddress } = req.body;
    
    const newCourse = {
      id: `course_${Date.now()}`,
      title,
      description,
      duration: duration || null,
      lessons: lessons,
      lessonsCount: lessons.length,
      creatorAddress,
      status: "draft",
      createdAt: new Date().toISOString(),
    };

    mockCourses.push(newCourse);

    console.log(`🎓 [BACKEND] Course created: ${newCourse.id}`);
    console.log(`🎓 [BACKEND] Title: ${title}`);
    console.log(`🎓 [BACKEND] Creator: ${creatorAddress}`);
    console.log(`🎓 [BACKEND] Lessons: ${lessons.length}`);
    console.log(`🎓 [BACKEND] Total courses in DB: ${mockCourses.length}`);

    res.json({
      success: true,
      data: { course: newCourse },
      message: "Course created successfully",
    });
  } catch (error: any) {
    console.error(`❌ [BACKEND] Error creating course:`, error);
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

  console.log(`📚 [BACKEND] Fetching courses for: ${address}`);
  console.log(`📚 [BACKEND] Found: ${userCourses.length} courses`);
  console.log(`📚 [BACKEND] Total courses in DB: ${mockCourses.length}`);
  console.log(`📚 [BACKEND] Courses:`, userCourses.map(c => ({ id: c.id, title: c.title, status: c.status })));

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

// Certificate endpoints
app.post("/api/certificates/claim", async (req, res) => {
  try {
    const { courseId, studentAddress } = req.body;

    if (!courseId || !studentAddress) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: courseId, studentAddress",
      });
    }

    const course = mockCourses.find(c => c.id === courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        error: "Course not found",
      });
    }

    if (course.status !== "verified") {
      return res.status(400).json({
        success: false,
        error: "Course must be verified before claiming certificate",
      });
    }

    // Check if certificate already claimed
    const existingCert = mockCertificates.find(
      c => c.courseId === courseId && c.studentAddress.toLowerCase() === studentAddress.toLowerCase()
    );
    
    if (existingCert) {
      return res.json({
        success: true,
        message: "Certificate already claimed",
        data: { certificate: existingCert },
      });
    }

    // Mint NFT certificate
    const tokenId = course.nftTokenId || Math.floor(Math.random() * 10000).toString();
    const tokenURI = course.nftTokenURI || `https://ipfs.io/ipfs/mock-${tokenId}`;
    const txHash = course.nftTxHash || `0x${Math.random().toString(16).substr(2, 64)}`;

    const certificate = {
      id: `cert_${Date.now()}`,
      tokenId,
      tokenURI,
      txHash,
      courseId,
      courseName: course.title,
      courseDescription: course.description,
      studentAddress,
      studentName: `Student ${studentAddress.slice(0, 6)}`,
      completionDate: new Date().toISOString(),
      claimedAt: new Date().toISOString(),
      network: "Status Sepolia",
      gasless: true,
    };

    mockCertificates.push(certificate);
    course.certificateClaimed = true;
    course.certificateClaimedAt = new Date().toISOString();

    console.log(`🎓 [BACKEND] Certificate claimed: ${certificate.id}`);
    console.log(`🎓 [BACKEND] Token ID: ${tokenId}`);
    console.log(`🎓 [BACKEND] Course: ${course.title}`);
    console.log(`🎓 [BACKEND] Student: ${studentAddress}`);
    console.log(`🎓 [BACKEND] Total certificates: ${mockCertificates.length}`);

    res.json({
      success: true,
      message: "Certificate claimed successfully",
      data: { certificate },
    });
  } catch (error: any) {
    console.error(`❌ [BACKEND] Error claiming certificate:`, error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to claim certificate",
    });
  }
});

app.get("/api/certificates/user/:address", (req, res) => {
  const { address } = req.params;
  
  if (!address) {
    return res.status(400).json({
      success: false,
      error: "Address is required",
    });
  }

  const userCertificates = mockCertificates.filter(
    c => c.studentAddress.toLowerCase() === address.toLowerCase()
  );

  console.log(`🎓 [BACKEND] Fetching certificates for: ${address}`);
  console.log(`🎓 [BACKEND] Found: ${userCertificates.length} certificates`);

  res.json({
    success: true,
    certificates: userCertificates,
  });
});

// API Routes for Verification
app.post("/api/courses/submit-verification", (req, res) => {
  try {
    const { courseId, studentAddress, proofOfCompletion, proofImage } = req.body;
    
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
      id: `req_${Date.now()}`,
      courseId,
      courseTitle: course.title,
      courseDescription: course.description || "",
      studentAddress,
      lessonsCount: course.lessonsCount,
      proofOfCompletion: proofOfCompletion || "Course completed",
      proofImage: proofImage || null,
      submittedAt: new Date().toISOString(),
      status: "pending",
    };

    mockVerificationRequests.push(verificationRequest);

    console.log(`📋 [BACKEND] Verification request created: ${verificationRequest.id}`);
    console.log(`📋 [BACKEND] Course: ${course.title}`);
    console.log(`📋 [BACKEND] Student: ${studentAddress}`);
    console.log(`📋 [BACKEND] Has proof image: ${!!proofImage}`);
    console.log(`📋 [BACKEND] Total pending requests: ${mockVerificationRequests.filter(r => r.status === 'pending').length}`);

    res.json({
      success: true,
      message: "Course submitted for verification",
      data: { verificationRequest },
    });
  } catch (error: any) {
    console.error(`❌ [BACKEND] Error submitting for verification:`, error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to submit course",
    });
  }
});

app.get("/api/verification/requests", (req, res) => {
  const pendingRequests = mockVerificationRequests.filter(r => r.status === "pending");
  
  console.log(`🔍 [BACKEND] Fetching verification requests`);
  console.log(`🔍 [BACKEND] Total requests: ${mockVerificationRequests.length}`);
  console.log(`🔍 [BACKEND] Pending requests: ${pendingRequests.length}`);
  
  res.json({
    success: true,
    requests: pendingRequests,
  });
});

app.post("/api/verification/verify", async (req, res) => {
  try {
    const { requestId, verifierAddress, status, reason } = req.body;
    
    console.log(`✅ [BACKEND] Processing verification: ${requestId}`);
    console.log(`✅ [BACKEND] Status: ${status}`);
    console.log(`✅ [BACKEND] Verifier: ${verifierAddress}`);
    
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
        console.log(`✅ [BACKEND] Course verified: ${course.title}`);
      } else if (status === "rejected") {
        course.rejectedAt = new Date().toISOString();
        course.rejectionReason = reason;
        console.log(`❌ [BACKEND] Course rejected: ${course.title}. Reason: ${reason}`);
      }
    }

    // If verified, prepare NFT certificate data
    if (status === "verified") {
      // Simulate NFT minting
      const tokenId = Math.floor(Math.random() * 10000).toString();
      const tokenURI = `https://ipfs.io/ipfs/mock-${tokenId}`;
      const txHash = `0x${Math.random().toString(16).substr(2, 64)}`;

      // Store NFT data in course for claiming later
      if (course) {
        course.nftTokenId = tokenId;
        course.nftTokenURI = tokenURI;
        course.nftTxHash = txHash;
      }

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


