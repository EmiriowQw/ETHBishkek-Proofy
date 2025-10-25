# 🎓 Verification System Guide

## Overview
Complete guide for the course verification system with proof of completion (text + image) and NFT certificate issuance.

---

## 🔄 Complete Verification Flow

### For Students (Course Creators)

#### 1. Create Course
- Navigate to `/create-course`
- Fill in course details (title, description, lessons)
- Minimum 3 lessons required
- Click "Create Course"

#### 2. Submit for Verification
- Go to "My Courses" page
- Find your course (status: Draft)
- Click "Submit for Verification"
- **Required:**
  - **Description** (min 50 characters): Explain what you learned, key concepts, projects completed
  - **Proof Image** (max 5MB): Upload screenshot, certificate, or project result
  - Supported formats: JPG, PNG, WEBP

#### 3. Wait for Review
- Course status changes to "Pending"
- Admin will review your submission
- Usually takes 24-48 hours

#### 4. Get Results
- **✅ Verified**: NFT certificate is minted automatically (gasless!)
  - Unique token ID assigned
  - Certificate sent to your wallet
  - Status: Verified
  
- **❌ Rejected**: Detailed feedback provided
  - Read rejection reason
  - Make improvements
  - Resubmit when ready

---

### For Developers/Admins (Verifiers)

#### Access Verification Panel
- Connect wallet with admin privileges
- Navigate to `/verification`
- See all pending verification requests

#### Review Requests
Each request shows:
- Course title and description
- Student wallet address
- Number of lessons completed
- Submission date
- **Proof of Completion - Description**: Student's written explanation
- **Proof of Completion - Image**: Visual evidence (if provided)

#### Make Decision

**Option 1: Verify ✅**
1. Click "Review Details" on a request
2. Carefully review:
   - Course content quality
   - Proof description authenticity
   - Proof image validity
3. Click "✅ Verify & Issue Certificate"
4. System automatically:
   - Mints unique NFT certificate
   - Generates token ID
   - Creates token URI
   - Simulates blockchain transaction
   - Notifies student

**Option 2: Reject ❌**
1. Click "Review Details" on a request
2. Click "❌ Reject Request"
3. Provide detailed feedback (min 10 characters)
4. Be specific and constructive
5. Student receives feedback and can resubmit

---

## 📸 Image Upload Component

### Features
- Drag & drop or click to upload
- File validation (type, size)
- Live preview
- Easy removal
- Max 5MB per image
- Formats: JPEG, PNG, WEBP

### How It Works
```typescript
<ImageUpload 
  onImageChange={setProofImage}
  maxSizeMB={5}
/>
```

---

## 🎫 NFT Certificate Minting

### When Verification is Approved
```javascript
{
  tokenId: "7854",           // Unique NFT ID
  tokenURI: "ipfs://...",    // Metadata location
  txHash: "0x...",           // Transaction hash
  status: "verified",
  network: "Status Sepolia"
}
```

### Token Details
- **Gasless**: No gas fees for students
- **Unique**: Each certificate gets unique token ID
- **On-chain**: Stored on blockchain
- **Immutable**: Cannot be altered after minting
- **Transferable**: Can be sent to other wallets

---

## 🔐 Backend API Endpoints

### Submit for Verification
```http
POST /api/courses/submit-verification
Content-Type: application/json

{
  "courseId": "course_123",
  "studentAddress": "0x...",
  "proofOfCompletion": "I learned React, Next.js...",
  "proofImage": "data:image/png;base64,..."
}
```

### Get Pending Requests
```http
GET /api/verification/requests

Response:
{
  "success": true,
  "requests": [
    {
      "id": "req_123",
      "courseId": "course_123",
      "courseTitle": "Web3 Development",
      "courseDescription": "...",
      "studentAddress": "0x...",
      "lessonsCount": 5,
      "proofOfCompletion": "...",
      "proofImage": "data:image/png;base64,...",
      "submittedAt": "2025-10-25T12:00:00Z",
      "status": "pending"
    }
  ]
}
```

### Process Verification
```http
POST /api/verification/verify
Content-Type: application/json

{
  "requestId": "req_123",
  "verifierAddress": "0x...",
  "status": "verified" | "rejected",
  "reason": "Optional rejection reason"
}

Response (if verified):
{
  "success": true,
  "message": "Course verified and NFT certificate minted",
  "data": {
    "status": "verified",
    "tokenId": "7854",
    "tokenURI": "https://ipfs.io/ipfs/mock-7854",
    "txHash": "0x..."
  }
}
```

---

## 📱 User Interface

### My Courses Page
- Lists all user's courses
- Status badges (Draft, Pending, Verified, Rejected)
- Submit button for draft courses
- Rejection reason display
- Resubmit option for rejected courses

### Verification Page (Admin)
- Pending requests count badge
- Request cards with key info
- "Review Details" modal
- Visual proof display with zoom
- Verify/Reject buttons
- Rejection feedback form

---

## 🎨 Status Colors

| Status | Color | Icon |
|--------|-------|------|
| Draft | Gray | 📝 |
| Pending | Yellow | ⏳ |
| Verified | Green | ✅ |
| Rejected | Red | ❌ |

---

## ✅ Validation Rules

### Course Creation
- Title: min 5 characters
- Description: min 20 characters
- Lessons: min 3 lessons
- Each lesson: min 50 characters content

### Verification Submission
- Proof description: min 50 characters
- Proof image: required
- Image size: max 5MB
- Image format: JPG, PNG, WEBP

### Rejection
- Reason: min 10 characters
- Must be constructive and specific

---

## 🚀 Testing the System

### Complete Test Scenario

1. **Create Course**
   ```
   - Title: "Introduction to Web3"
   - Description: "Learn blockchain basics..."
   - Add 3-5 lessons
   - Each lesson with title + content
   ```

2. **Submit for Verification**
   ```
   - Write proof: "I completed all lessons, learned about smart contracts..."
   - Upload screenshot of completed work
   - Submit
   ```

3. **Admin Reviews**
   ```
   - Open /verification page
   - See new pending request
   - Click "Review Details"
   - View proof description
   - Check proof image
   - Decide: Verify or Reject
   ```

4. **Check Results**
   ```
   - Student: Check "My Courses"
   - If verified: See green badge, NFT info
   - If rejected: See rejection reason, can resubmit
   ```

---

## 💡 Tips for Students

### Writing Good Proof
- Be specific about what you learned
- Mention key concepts covered
- Describe projects or assignments completed
- Explain how you'll apply the knowledge

### Taking Good Proof Images
- Clear and readable screenshots
- Show completed assignments or projects
- Include certificates from course platforms
- Ensure good lighting and resolution
- No personal sensitive information visible

---

## 🛠️ For Developers

### File Structure
```
components/
  └─ ImageUpload.tsx          # Image upload component

pages/
  ├─ my-courses.tsx           # Student course management
  └─ verification.tsx         # Admin verification panel

backend/src/
  └─ index-simple.ts          # Backend API with NFT minting
```

### Key Features
- Image to base64 conversion
- In-memory mock storage
- Automatic NFT minting on verification
- Gasless transactions (demo mode)
- Toast notifications for all actions

### Environment Variables
```env
PORT=3001
CORS_ORIGIN=http://localhost:3000
```

---

## 📞 Support

For issues or questions:
1. Check console logs for error details
2. Verify wallet connection
3. Ensure backend is running on port 3001
4. Frontend should be on port 3000
5. Check image size and format

---

## 🎯 Summary

This verification system provides:
- ✅ Proof-based verification (text + image)
- ✅ Admin review panel
- ✅ Automatic NFT minting
- ✅ Gasless transactions
- ✅ Rejection feedback system
- ✅ Resubmission capability
- ✅ Real-time status updates

All designed for educational course certification on the blockchain! 🎓

