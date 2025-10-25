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

// Predefined categories with specific fields
const categories = [
  {
    id: 'education',
    name: 'Education',
    icon: '🎓',
    description: 'Academic achievements, courses, and certifications',
    fields: ['institution', 'degree', 'graduationDate', 'gpa'],
    color: 'blue'
  },
  {
    id: 'sports',
    name: 'Sports',
    icon: '🏋️',
    description: 'Athletic achievements, competitions, and training',
    fields: ['sportType', 'eventName', 'placement', 'date', 'organizer'],
    color: 'orange'
  },
  {
    id: 'volunteering',
    name: 'Volunteering',
    icon: '🤝',
    description: 'Community service and volunteer work',
    fields: ['organization', 'hours', 'activityType', 'startDate', 'endDate'],
    color: 'green'
  },
  {
    id: 'skills',
    name: 'Skills & HR',
    icon: '💼',
    description: 'Professional skills and competencies',
    fields: ['skillName', 'level', 'projects', 'yearsExperience'],
    color: 'purple'
  }
];

// Mock data storage
const mockCourses: any[] = [];  // Keep for backward compatibility
const mockAchievements: any[] = [];
const mockCustomCategories: any[] = [];
const mockVerifiers: any[] = [];
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
// OLD CERTIFICATE CLAIM ENDPOINT REMOVED - Using new unified endpoint below that handles both courses and achievements

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

// OLD ENDPOINT REMOVED - Using new unified endpoint below that handles both courses and achievements

// ============================================
// CATEGORIES API
// ============================================

// Get all categories (predefined + custom)
app.get("/api/categories", (req, res) => {
  const allCategories = [...categories, ...mockCustomCategories];
  
  console.log(`📂 [BACKEND] Fetching categories`);
  console.log(`📂 [BACKEND] Predefined: ${categories.length}, Custom: ${mockCustomCategories.length}`);
  
  res.json({
    success: true,
    categories: allCategories,
  });
});

// Create custom category
app.post("/api/categories/custom", (req, res) => {
  try {
    const { name, icon, description, fields, creatorAddress } = req.body;
    
    if (!name || !fields || !Array.isArray(fields)) {
      return res.status(400).json({
        success: false,
        error: "Name and fields are required",
      });
    }

    const customCategory = {
      id: `custom_${Date.now()}`,
      name,
      icon: icon || '📌',
      description: description || '',
      fields,
      color: 'gray',
      creatorAddress,
      createdAt: new Date().toISOString(),
      isCustom: true,
    };

    mockCustomCategories.push(customCategory);

    console.log(`📂 [BACKEND] Custom category created: ${customCategory.name}`);
    console.log(`📂 [BACKEND] Fields: ${fields.join(', ')}`);

    res.json({
      success: true,
      category: customCategory,
      message: "Custom category created successfully",
    });
  } catch (error: any) {
    console.error(`❌ [BACKEND] Error creating custom category:`, error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to create custom category",
    });
  }
});

// ============================================
// ACHIEVEMENTS API
// ============================================

// Create achievement
app.post("/api/achievements/create", (req, res) => {
  try {
    const { title, description, category, specificData, creatorAddress } = req.body;
    
    if (!title || !category || !creatorAddress) {
      return res.status(400).json({
        success: false,
        error: "Title, category, and creator address are required",
      });
    }

    const newAchievement = {
      id: `ach_${Date.now()}`,
      title,
      description,
      category,
      specificData: specificData || {},
      creatorAddress,
      status: "draft",
      createdAt: new Date().toISOString(),
      proofImage: null,
      proofDescription: null,
    };

    mockAchievements.push(newAchievement);

    console.log(`🎯 [BACKEND] Achievement created: ${newAchievement.id}`);
    console.log(`🎯 [BACKEND] Title: ${title}`);
    console.log(`🎯 [BACKEND] Category: ${category}`);
    console.log(`🎯 [BACKEND] Creator: ${creatorAddress}`);
    console.log(`🎯 [BACKEND] Total achievements: ${mockAchievements.length}`);

    res.json({
      success: true,
      data: { achievement: newAchievement },
      message: "Achievement created successfully",
    });
  } catch (error: any) {
    console.error(`❌ [BACKEND] Error creating achievement:`, error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to create achievement",
    });
  }
});

// Get user's achievements
app.get("/api/achievements/my-achievements", (req, res) => {
  const { address } = req.query;
  
  if (!address) {
    return res.status(400).json({
      success: false,
      error: "Address is required",
    });
  }

  const userAchievements = mockAchievements.filter(
    a => a.creatorAddress.toLowerCase() === (address as string).toLowerCase()
  );

  console.log(`🎯 [BACKEND] Fetching achievements for: ${address}`);
  console.log(`🎯 [BACKEND] Found: ${userAchievements.length} achievements`);
  userAchievements.forEach((a) => {
    console.log(`   - ${a.title}: status = ${a.status}`);
  });

  res.json({
    success: true,
    achievements: userAchievements,
  });
});

// Get specific achievement
app.get("/api/achievements/:id", (req, res) => {
  const achievement = mockAchievements.find(a => a.id === req.params.id);
  
  if (!achievement) {
    return res.status(404).json({ 
      success: false, 
      error: "Achievement not found" 
    });
  }
  
  res.json({ 
    success: true, 
    achievement 
  });
});

// Submit achievement for verification
app.post("/api/achievements/submit-verification", (req, res) => {
  try {
    const { achievementId, studentAddress, proofOfCompletion, proofImage } = req.body;
    
    const achievement = mockAchievements.find(a => a.id === achievementId);
    if (!achievement) {
      return res.status(404).json({
        success: false,
        error: "Achievement not found",
      });
    }

    // Update achievement status
    achievement.status = "submitted";
    achievement.submittedAt = new Date().toISOString();
    achievement.proofDescription = proofOfCompletion;
    achievement.proofImage = proofImage;

    // Create verification request
    const verificationRequest = {
      id: `req_${Date.now()}`,
      achievementId,
      achievementTitle: achievement.title,
      achievementDescription: achievement.description || "",
      category: achievement.category,
      specificData: achievement.specificData,
      studentAddress,
      proofOfCompletion: proofOfCompletion || "Achievement completed",
      proofImage: proofImage || null,
      submittedAt: new Date().toISOString(),
      status: "pending",
    };

    mockVerificationRequests.push(verificationRequest);

    console.log(`📋 [BACKEND] Verification request created: ${verificationRequest.id}`);
    console.log(`📋 [BACKEND] Achievement: ${achievement.title}`);
    console.log(`📋 [BACKEND] Category: ${achievement.category}`);
    console.log(`📋 [BACKEND] Student: ${studentAddress}`);

    res.json({
      success: true,
      message: "Achievement submitted for verification",
      data: { verificationRequest },
    });
  } catch (error: any) {
    console.error(`❌ [BACKEND] Error submitting achievement:`, error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to submit achievement",
    });
  }
});

// ============================================
// VERIFIERS API
// ============================================

// Register as verifier
app.post("/api/verifiers/register", (req, res) => {
  try {
    const { address, name, categories: selectedCategories, credentials } = req.body;
    
    if (!address || !selectedCategories || !Array.isArray(selectedCategories)) {
      return res.status(400).json({
        success: false,
        error: "Address and categories are required",
      });
    }

    // Check if already registered
    const existing = mockVerifiers.find(v => v.address.toLowerCase() === address.toLowerCase());
    if (existing) {
      return res.status(400).json({
        success: false,
        error: "Already registered as verifier",
      });
    }

    const newVerifier = {
      address,
      name: name || `Verifier ${address.slice(0, 6)}`,
      categories: selectedCategories, // Fixed: was 'roles', now 'categories'
      credentials: credentials || '',
      status: 'active',  // Simplified: auto-approve for demo
      approvedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    mockVerifiers.push(newVerifier);

    console.log(`🛡️ [BACKEND] Verifier registered: ${newVerifier.name}`);
    console.log(`🛡️ [BACKEND] Categories: ${selectedCategories.join(', ')}`);
    console.log(`🛡️ [BACKEND] Total verifiers: ${mockVerifiers.length}`);

    res.json({
      success: true,
      verifier: newVerifier,
      message: "Registered as verifier successfully",
    });
  } catch (error: any) {
    console.error(`❌ [BACKEND] Error registering verifier:`, error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to register as verifier",
    });
  }
});

// Check user's verifier role
app.get("/api/verifiers/my-role", (req, res) => {
  const { address } = req.query;
  
  if (!address) {
    return res.status(400).json({
      success: false,
      error: "Address is required",
    });
  }

  const verifier = mockVerifiers.find(
    v => v.address.toLowerCase() === (address as string).toLowerCase()
  );

  console.log(`🛡️ [BACKEND] Checking verifier role for: ${address}`);
  console.log(`🛡️ [BACKEND] Is verifier: ${!!verifier}`);
  if (verifier) {
    console.log(`🛡️ [BACKEND] Verifier categories:`, verifier.categories);
  }

  res.json({
    success: true,
    isVerifier: !!verifier,
    verifier: verifier || null,
  });
});

// Update verification requests endpoint to support category filtering
app.get("/api/verification/requests", (req, res) => {
  const { category } = req.query;
  
  let requests = mockVerificationRequests.filter(r => r.status === "pending");
  
  // Filter by category if specified
  if (category && category !== 'all') {
    requests = requests.filter(r => r.category === category);
  }
  
  console.log(`🔍 [BACKEND] Fetching verification requests`);
  console.log(`🔍 [BACKEND] Category filter: ${category || 'all'}`);
  console.log(`🔍 [BACKEND] Found: ${requests.length} requests`);
  
  res.json({
    success: true,
    requests,
  });
});

// Update verification verify endpoint to handle achievements
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

    // Update achievement or course status
    const achievement = mockAchievements.find(a => a.id === request.achievementId);
    const course = mockCourses.find(c => c.id === request.courseId);
    
    const item = achievement || course;
    
    if (!item) {
      console.error(`❌ [BACKEND] Item not found! Achievement ID: ${request.achievementId}, Course ID: ${request.courseId}`);
      return res.status(404).json({
        success: false,
        error: "Achievement or course not found",
      });
    }
    
    console.log(`📝 [BACKEND] Found item: ${item.title}`);
    console.log(`📝 [BACKEND] Item ID: ${item.id}`);
    console.log(`📝 [BACKEND] Old status: ${item.status} → New status: ${status}`);
    
    // Update status with explicit type casting
    item.status = status as any;
    item.verifierAddress = verifierAddress;
      
      if (status === "verified") {
        item.verifiedAt = new Date().toISOString();
        
        // Generate NFT data
        const tokenId = Math.floor(Math.random() * 10000).toString();
        const tokenURI = `https://ipfs.io/ipfs/mock-${tokenId}`;
        const txHash = `0x${Math.random().toString(16).substr(2, 64)}`;

        item.nftTokenId = tokenId;
        item.nftTokenURI = tokenURI;
        item.nftTxHash = txHash;
        
        console.log(`✅ [BACKEND] Item verified: ${item.title}`);
        console.log(`✅ [BACKEND] NFT Token ID: ${tokenId}`);
        console.log(`✅ [BACKEND] Status is now: ${item.status}`);
        
        // Double-check the item is in the array
        if (achievement) {
          const found = mockAchievements.find(a => a.id === achievement.id);
          console.log(`✅ [BACKEND] Achievement still in array: ${!!found}, Status: ${found?.status}`);
        }
        
        res.json({
          success: true,
          message: "Item verified and NFT certificate minted",
          data: {
            status: "verified",
            tokenId,
            tokenURI,
            txHash,
          },
        });
      } else if (status === "rejected") {
        item.rejectedAt = new Date().toISOString();
        item.rejectionReason = reason;
        console.log(`❌ [BACKEND] Item rejected: ${item.title}`);
        console.log(`❌ [BACKEND] Status is now: ${item.status}`);
        console.log(`❌ [BACKEND] Rejection reason: ${reason}`);
        
        res.json({
          success: true,
          message: "Verification request processed",
          data: {
            status,
            reason,
          },
        });
      } else {
        // Unknown status
        console.warn(`⚠️ [BACKEND] Unknown status: ${status}`);
        res.json({
          success: true,
          message: "Verification request processed",
          data: { status },
        });
      }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to process verification",
    });
  }
});

// Update certificate claim to support achievements
app.post("/api/certificates/claim", async (req, res) => {
  try {
    const { courseId, achievementId, studentAddress } = req.body;

    console.log(`🎓 [BACKEND] Certificate claim request received`);
    console.log(`🎓 [BACKEND] Course ID: ${courseId}`);
    console.log(`🎓 [BACKEND] Achievement ID: ${achievementId}`);
    console.log(`🎓 [BACKEND] Student: ${studentAddress}`);

    if (!studentAddress || (!courseId && !achievementId)) {
      console.error(`❌ [BACKEND] Missing required fields!`);
      return res.status(400).json({
        success: false,
        error: "Missing required fields: studentAddress and either courseId or achievementId",
      });
    }

    const item = achievementId 
      ? mockAchievements.find(a => a.id === achievementId)
      : mockCourses.find(c => c.id === courseId);
    
    console.log(`🔍 [BACKEND] Looking for ${achievementId ? 'achievement' : 'course'}: ${achievementId || courseId}`);
    console.log(`🔍 [BACKEND] Item found: ${!!item}`);
    if (item) {
      console.log(`🔍 [BACKEND] Item title: ${item.title}`);
      console.log(`🔍 [BACKEND] Item status: ${item.status}`);
    }
      
    if (!item) {
      console.error(`❌ [BACKEND] Item not found!`);
      return res.status(404).json({
        success: false,
        error: "Item not found",
      });
    }

    if (item.status !== "verified") {
      return res.status(400).json({
        success: false,
        error: "Item must be verified before claiming certificate",
      });
    }

    // Check if certificate already claimed
    const existingCert = mockCertificates.find(
      c => (c.achievementId === achievementId || c.courseId === courseId) && 
           c.studentAddress.toLowerCase() === studentAddress.toLowerCase()
    );
    
    if (existingCert) {
      return res.json({
        success: true,
        message: "Certificate already claimed",
        data: { certificate: existingCert },
      });
    }

    // Mint NFT certificate
    const tokenId = item.nftTokenId || Math.floor(Math.random() * 10000).toString();
    const tokenURI = item.nftTokenURI || `https://ipfs.io/ipfs/mock-${tokenId}`;
    const txHash = item.nftTxHash || `0x${Math.random().toString(16).substr(2, 64)}`;

    const certificate = {
      id: `cert_${Date.now()}`,
      tokenId,
      tokenURI,
      txHash,
      courseId: courseId || null,
      achievementId: achievementId || null,
      category: item.category || 'education',
      courseName: item.title,
      courseDescription: item.description,
      specificData: item.specificData || {},
      studentAddress,
      studentName: `Student ${studentAddress.slice(0, 6)}`,
      completionDate: new Date().toISOString(),
      claimedAt: new Date().toISOString(),
      network: "Status Sepolia",
      gasless: true,
    };

    mockCertificates.push(certificate);
    item.certificateClaimed = true;
    item.certificateClaimedAt = new Date().toISOString();

    console.log(`✅ [BACKEND] Certificate claimed successfully!`);
    console.log(`🎓 [BACKEND] Certificate ID: ${certificate.id}`);
    console.log(`🎓 [BACKEND] Token ID: ${tokenId}`);
    console.log(`🎓 [BACKEND] Category: ${certificate.category}`);
    console.log(`🎓 [BACKEND] Item: ${item.title}`);
    console.log(`🎓 [BACKEND] Student: ${studentAddress}`);
    console.log(`🎓 [BACKEND] Total certificates in storage: ${mockCertificates.length}`);

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


