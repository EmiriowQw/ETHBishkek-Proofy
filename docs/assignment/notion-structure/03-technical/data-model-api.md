# Data Model & API Documentation

## Data Models

### User (Wallet-Based)
```typescript
interface User {
  address: string;  // Wallet address (primary key)
  // No password/auth - wallet signature is authentication
}
```

**Notes:**
- No traditional user registration
- Wallet address serves as user identifier
- Wallet connection via MetaMask/RainbowKit

---

### Category
```typescript
interface Category {
  id: string;                    // 'education', 'sports', 'volunteering', 'skills', or 'custom_*'
  name: string;                  // Display name
  icon: string;                  // Emoji icon (🎓, 🏋️, 🤝, 💼, 📌)
  description: string;           // Category description
  fields: string[];              // Dynamic form fields (e.g., ['institution', 'degree', 'gpa'])
  color: string;                 // 'blue', 'orange', 'green', 'purple', 'gray'
  isCustom: boolean;             // Whether user-created
  creatorAddress?: string;       // For custom categories
  createdAt?: string;            // ISO timestamp
}
```

**Predefined Categories:**
- `education`: institution, degree, graduationDate, gpa
- `sports`: sportType, eventName, placement, date, organizer
- `volunteering`: organization, hours, activityType, startDate, endDate
- `skills`: skillName, level, projects, yearsExperience

---

### Achievement
```typescript
interface Achievement {
  id: string;                    // 'ach_timestamp'
  title: string;                 // Achievement title
  description: string;           // Full description
  category: string;              // Category ID
  specificData: Record<string, any>; // Category-specific fields
  creatorAddress: string;        // Wallet address of creator
  status: 'draft' | 'pending' | 'verified' | 'rejected';
  proofImage?: string;           // Base64 encoded image
  proofDescription?: string;     // Proof explanation (min 50 chars)
  submittedAt?: string;          // ISO timestamp
  verifiedAt?: string;           // ISO timestamp
  verifierAddress?: string;      // Verifier wallet address
  rejectionReason?: string;      // Rejection feedback
  createdAt: string;             // ISO timestamp
}
```

**Status Flow:**
1. `draft` → Created but not submitted
2. `pending` → Submitted for verification
3. `verified` → Approved by verifier
4. `rejected` → Rejected by verifier

---

### Verifier
```typescript
interface Verifier {
  address: string;               // Wallet address (primary key)
  name: string;                  // Verifier name
  credentials: string;           // Expertise description (min 50 chars)
  categories: string[];          // Array of category IDs they verify
  registeredAt: string;          // ISO timestamp
}
```

**Notes:**
- Verifiers must register separately
- Can specialize in multiple categories
- Different wallet address from achievement creators (prevents self-verification)

---

### Verification Request
```typescript
interface VerificationRequest {
  id: string;                    // 'req_timestamp'
  achievementId: string;         // Linked achievement
  studentAddress: string;        // Achievement creator
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;           // ISO timestamp
  reviewedAt?: string;           // ISO timestamp
  verifierAddress?: string;      // Verifier wallet address
  feedback?: string;             // Approval/rejection feedback
}
```

**Notes:**
- Created when achievement is submitted for verification
- Linked to achievement for data consistency
- Separate entity for tracking verification workflow

---

### Certificate (NFT)
```typescript
interface Certificate {
  tokenId: string;               // NFT token ID
  achievementId: string;         // Linked achievement
  studentAddress: string;        // Owner wallet address
  category: string;              // Category ID
  title: string;                 // Certificate title
  description: string;           // Full description
  specificData: Record<string, any>; // Achievement data
  mintedAt: string;              // ISO timestamp
  txHash: string;                // Blockchain transaction hash
  tokenURI: string;              // Metadata URI (future: IPFS)
}
```

**Notes:**
- Created when verified achievement is claimed
- Token ID generated on minting
- All data stored on-chain (blockchain verification)

---

## API Endpoints

### Health Check
```
GET /health
```
**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-10-26T12:00:00Z"
}
```

---

### Categories

#### Get All Categories
```
GET /api/categories
```
**Response:**
```json
{
  "success": true,
  "categories": [
    {
      "id": "education",
      "name": "Education",
      "icon": "🎓",
      "description": "Academic achievements",
      "fields": ["institution", "degree", "graduationDate", "gpa"],
      "color": "blue"
    },
    // ... more categories
  ]
}
```

#### Create Custom Category
```
POST /api/categories/custom
Body:
{
  "name": "Art",
  "icon": "🎨",
  "description": "Artistic achievements",
  "fields": ["medium", "exhibition", "award"],
  "creatorAddress": "0x123..."
}
```
**Response:**
```json
{
  "success": true,
  "category": { /* created category */ },
  "message": "Custom category created successfully"
}
```

---

### Achievements

#### Create Achievement
```
POST /api/achievements/create
Body:
{
  "title": "University Diploma",
  "description": "Bachelor's degree in Computer Science",
  "category": "education",
  "specificData": {
    "institution": "University Name",
    "degree": "Bachelor's",
    "graduationDate": "2024-05-15",
    "gpa": 3.8
  },
  "creatorAddress": "0x123..."
}
```
**Response:**
```json
{
  "success": true,
  "data": {
    "achievement": { /* created achievement */ }
  },
  "message": "Achievement created successfully"
}
```

#### Get My Achievements
```
GET /api/achievements/my-achievements?address=0x123...
```
**Response:**
```json
{
  "success": true,
  "achievements": [
    { /* achievement objects */ }
  ]
}
```

#### Get Achievement by ID
```
GET /api/achievements/:id
```
**Response:**
```json
{
  "success": true,
  "achievement": { /* achievement object */ }
}
```

#### Submit Achievement for Verification
```
POST /api/achievements/submit-verification
Body:
{
  "achievementId": "ach_123...",
  "proofImage": "data:image/jpeg;base64,...",
  "proofDescription": "Here is my diploma certificate..."
}
```
**Response:**
```json
{
  "success": true,
  "message": "Achievement submitted for verification",
  "data": {
    "verificationRequest": { /* request object */ }
  }
}
```

---

### Verifiers

#### Register as Verifier
```
POST /api/verifiers/register
Body:
{
  "address": "0x456...",
  "name": "Dr. Smith",
  "credentials": "PhD in Education, 10 years experience...",
  "categories": ["education", "skills"]
}
```
**Response:**
```json
{
  "success": true,
  "message": "Verifier registered successfully",
  "verifier": { /* verifier object */ }
}
```

#### Get My Verifier Role
```
GET /api/verifiers/my-role?address=0x456...
```
**Response:**
```json
{
  "success": true,
  "isVerifier": true,
  "verifier": { /* verifier object if exists */ }
}
```

---

### Verification

#### Get Verification Requests
```
GET /api/verification/requests?category=sports
```
**Query Parameters:**
- `category` (optional): Filter by category ID

**Response:**
```json
{
  "success": true,
  "requests": [
    {
      "id": "req_123...",
      "achievementId": "ach_123...",
      "title": "Marathon Win",
      "category": "sports",
      "studentAddress": "0x123...",
      "proofImage": "data:image/...",
      "submittedAt": "2024-10-26T12:00:00Z"
    }
  ]
}
```

#### Verify Achievement
```
POST /api/verification/verify
Body:
{
  "requestId": "req_123...",
  "verifierAddress": "0x456...",
  "status": "approved", // or "rejected"
  "feedback": "Congratulations! Verified and approved."
}
```
**Response:**
```json
{
  "success": true,
  "message": "Achievement verified successfully",
  "certificate": { /* certificate object if approved */ }
}
```

---

### Certificates

#### Claim Certificate (Gasless Mint)
```
POST /api/certificates/claim
Body:
{
  "achievementId": "ach_123...",
  "studentAddress": "0x123..."
}
```
**Response:**
```json
{
  "success": true,
  "message": "Certificate minted successfully",
  "data": {
    "tokenId": "123",
    "txHash": "0xabc...",
    "tokenURI": "https://..."
  }
}
```

#### Get User Certificates
```
GET /api/certificates/user/:address
```
**Response:**
```json
{
  "success": true,
  "certificates": [
    {
      "tokenId": "123",
      "title": "Marathon Win",
      "category": "sports",
      "mintedAt": "2024-10-26T12:00:00Z",
      "txHash": "0xabc..."
    }
  ]
}
```

---

## Error Responses

All endpoints return error responses in this format:
```json
{
  "success": false,
  "error": "Error message here"
}
```

**HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Internal Server Error

---

## Data Flow

1. **Achievement Creation:**
   - User creates achievement → Stored in `mockAchievements[]`
   - Status: `draft`

2. **Submission:**
   - User submits → Status: `pending`
   - Verification request created → Stored in `mockVerificationRequests[]`

3. **Verification:**
   - Verifier approves → Status: `verified`
   - NFT minting ready

4. **Claiming:**
   - User claims → Certificate created → Stored in `mockCertificates[]`
   - Token ID assigned, transaction hash generated

---

## Future Enhancements

- [ ] Database migration (PostgreSQL/MongoDB)
- [ ] IPFS integration for images
- [ ] Real blockchain transactions
- [ ] Pagination for large datasets
- [ ] Caching layer (Redis)
- [ ] API rate limiting
- [ ] Authentication middleware


