# Functional Requirements / Technical Assignment

## Project Title

**Proofy** — Universal blockchain-verified achievement platform with NFT certificates

## 1. Vision (1-2 lines)

Enable anyone to create, verify, and own immutable achievement certificates across any domain (education, sports, volunteering, skills) through expert verification and blockchain-secured NFT technology, eliminating credential fraud and platform lock-in.

## 2. Core Features (MVP)

### Feature 1: User Authentication via Wallet Connection
- **Priority:** High
- **Acceptance Criteria:** 
  - User can connect MetaMask wallet to the application
  - Wallet address is used as user identifier (no traditional login required)
  - Connected wallet persists across page refreshes
  - Disconnect functionality works correctly

### Feature 2: Achievement Creation Wizard
- **Priority:** High
- **Acceptance Criteria:**
  - User can select from 4 predefined categories (Education, Sports, Volunteering, Skills) or create custom category
  - Category-specific dynamic forms appear based on selection
  - Form validation prevents submission with missing required fields
  - User can save achievement as draft before submitting
  - Created achievement is linked to user's wallet address
  - Achievement stored with status "draft" initially

### Feature 3: Image Proof Upload
- **Priority:** High
- **Acceptance Criteria:**
  - User can upload proof image (JPG, PNG, max 5MB)
  - Image preview displays before submission
  - Image converted to Base64 for storage/transmission
  - Image is required when submitting achievement for verification
  - Validation ensures image format is correct

### Feature 4: Achievement Submission for Verification
- **Priority:** High
- **Acceptance Criteria:**
  - User can submit draft achievement for verification
  - Submission requires proof image and proof description (min 50 chars)
  - Achievement status changes from "draft" to "pending"
  - Achievement appears in verifier review queue
  - User receives confirmation message upon submission

### Feature 5: Expert Verifier Registration
- **Priority:** High
- **Acceptance Criteria:**
  - User can register as verifier with name, credentials (min 50 chars), and category selection
  - Verifier can select one or multiple categories to specialize in
  - Registration requires wallet connection (different from achievement creator)
  - Verifier role stored and linked to wallet address
  - Only registered verifiers can access verification panel

### Feature 6: Verification Panel with Approve/Reject
- **Priority:** High
- **Acceptance Criteria:**
  - Verifiers can view list of pending achievements
  - Filtering by category works correctly
  - Verifier can view full achievement details including proof image
  - Verifier can approve or reject with feedback message
  - Upon approval, NFT certificate is automatically minted
  - Upon rejection, achievement status changes to "rejected" with reason
  - Verification decision is irreversible

### Feature 7: NFT Certificate Claiming
- **Priority:** High
- **Acceptance Criteria:**
  - User can see verified achievements in "My Achievements" page
  - "Claim NFT Certificate" button appears for verified achievements
  - Clicking claim initiates gasless minting process (backend pays gas)
  - NFT is minted with unique token ID
  - Certificate appears in "My Certificates" gallery
  - Certificate includes all achievement metadata on-chain

### Feature 8: Certificate Gallery and Profile Pages
- **Priority:** Medium
- **Acceptance Criteria:**
  - User can view all their NFT certificates in gallery
  - Each certificate shows category, title, and verification date
  - Clicking certificate opens detailed profile page
  - Profile page displays beautiful category-specific design
  - Share, Download, and Copy link functionality works
  - Link to blockchain explorer displays correct transaction

### Feature 9: Achievement Management (My Achievements Page)
- **Priority:** Medium
- **Acceptance Criteria:**
  - User can view all their achievements (draft, pending, verified, rejected)
  - Filtering by status works correctly
  - Auto-refresh updates status every 10 seconds OR manual refresh button works
  - Draft achievements can be edited
  - Pending achievements show "Waiting for verification" status
  - Verified achievements show "Claim Certificate" button

### Feature 10: Custom Category Creation
- **Priority:** Medium
- **Acceptance Criteria:**
  - User can create custom category with name, icon, description
  - User defines custom fields for the category (array of field names)
  - Custom category appears in category selector
  - Achievements can be created using custom categories
  - Custom category form fields render dynamically

## 3. Non-Functional Requirements

### Performance
- Page load time: < 3 seconds on 3G connection
- API response time: < 500ms for standard requests
- Image upload processing: < 2 seconds for 5MB image

### Usability
- Responsive design: Works on mobile (320px+), tablet (768px+), desktop (1024px+)
- Accessibility: WCAG 2.1 Level AA compliance
- Intuitive navigation: Clear labels, consistent UI patterns
- Loading states: Skeleton screens during data fetch
- Error handling: User-friendly error messages with recovery options

### Security
- Wallet signature verification for sensitive actions
- Input validation: Prevent XSS and injection attacks
- CORS configuration: Restricted to frontend domain
- Rate limiting: Prevent API abuse
- Environment variables: No secrets in code

### Privacy
- Minimal data collection: Only wallet address and achievement data
- No PII storage: Names are optional and user-provided
- Blockchain transparency: Public records but pseudonymous (wallet addresses)

### Platforms & Technologies
- Frontend: Next.js 14+ (React 18), TypeScript, Tailwind CSS
- Backend: Node.js, Express, TypeScript
- Blockchain: Ethereum-compatible (Status Network), Solidity smart contracts
- Web3: Wagmi, RainbowKit for wallet connection
- Storage: In-memory mock data (MVP), prepared for IPFS/blockchain migration

### Scalability
- Architecture supports horizontal scaling
- Mock data storage can be replaced with database (PostgreSQL/MongoDB)
- Smart contracts support unlimited certificates
- API designed for future caching layer

## 4. API / Data Model

### Users (Wallet-Based)
```typescript
{
  address: string;          // Wallet address (primary key)
  // No password/traditional auth - wallet signature is authentication
}
```

### Categories
```typescript
{
  id: string;               // 'education', 'sports', 'volunteering', 'skills', or 'custom_*'
  name: string;
  icon: string;             // Emoji icon
  description: string;
  fields: string[];         // Dynamic form fields for this category
  color: string;            // 'blue', 'orange', 'green', 'purple', 'gray'
  isCustom: boolean;
  creatorAddress?: string;  // For custom categories
}
```

### Achievements
```typescript
{
  id: string;               // 'ach_timestamp'
  title: string;
  description: string;
  category: string;         // Category ID
  specificData: object;     // Category-specific fields (e.g., {institution, degree, gpa})
  creatorAddress: string;   // Wallet address
  status: 'draft' | 'pending' | 'verified' | 'rejected';
  proofImage?: string;      // Base64 encoded image
  proofDescription?: string;
  submittedAt?: string;     // ISO timestamp
  verifiedAt?: string;
  verifierAddress?: string;
  rejectionReason?: string;
  createdAt: string;
}
```

### Verifiers
```typescript
{
  address: string;          // Wallet address (primary key)
  name: string;
  credentials: string;      // Expertise description
  categories: string[];     // Array of category IDs they verify
  registeredAt: string;
}
```

### Verification Requests
```typescript
{
  id: string;               // 'req_timestamp'
  achievementId: string;
  studentAddress: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  verifierAddress?: string;
  feedback?: string;
}
```

### Certificates (NFTs)
```typescript
{
  tokenId: string;          // NFT token ID
  achievementId: string;
  studentAddress: string;
  category: string;
  title: string;
  description: string;
  specificData: object;
  mintedAt: string;
  txHash: string;           // Blockchain transaction hash
  tokenURI: string;         // Metadata URI
}
```

### API Endpoints

```
Health:
GET  /health

Categories:
GET  /api/categories
POST /api/categories/custom

Achievements:
POST /api/achievements/create
GET  /api/achievements/my-achievements?address={wallet}
GET  /api/achievements/:id
POST /api/achievements/submit-verification

Verifiers:
POST /api/verifiers/register
GET  /api/verifiers/my-role?address={wallet}

Verification:
GET  /api/verification/requests?category={categoryId}
POST /api/verification/verify

Certificates:
POST /api/certificates/claim
GET  /api/certificates/user/:address
```

## 5. Acceptance Tests

### Test 1: Achievement Creation Flow
**Given:** User has connected wallet (0x123...)
**When:** User fills achievement form (Sports category, title "Marathon Win", all required fields)
**Then:** Achievement created with status "draft", stored with creatorAddress = 0x123...

### Test 2: Achievement Submission
**Given:** Achievement exists with status "draft"
**When:** User uploads proof image and description (60 chars), clicks "Submit for Verification"
**Then:** Achievement status changes to "pending", appears in verification queue

### Test 3: Verifier Registration
**Given:** New wallet (0x456...) connects
**When:** User fills verifier form (name, credentials 60 chars, selects "Sports" category)
**Then:** Verifier registered, can access verification panel

### Test 4: Achievement Verification - Approve
**Given:** Achievement with status "pending" exists, verifier (0x456...) is registered for "Sports"
**When:** Verifier views achievement, clicks "Approve", provides feedback
**Then:** Achievement status changes to "verified", NFT minting process initiates, certificate created

### Test 5: Achievement Verification - Reject
**Given:** Achievement with status "pending" exists, verifier registered
**When:** Verifier clicks "Reject", provides rejection reason (min 20 chars)
**Then:** Achievement status changes to "rejected", reason stored, no NFT minted

### Test 6: Certificate Claiming
**Given:** Achievement with status "verified" exists
**When:** User (achievement creator) clicks "Claim NFT Certificate"
**Then:** Gasless minting executes, certificate appears in user's gallery, token ID generated

### Test 7: Certificate Display
**Given:** Certificate exists with tokenId "123"
**When:** User navigates to /certificates/123
**Then:** Beautiful profile page displays with all certificate details, share buttons work

### Test 8: Category-Specific Forms
**Given:** User selects "Education" category
**When:** Achievement creation form renders
**Then:** Form shows fields: institution, degree, graduationDate, gpa (Education-specific)

### Test 9: Filtering Verification Requests
**Given:** 5 pending achievements (3 Sports, 2 Education), verifier registered for "Sports"
**When:** Verifier accesses verification panel with filter "Sports"
**Then:** Only 3 Sports achievements are displayed

### Test 10: Status Updates Real-Time
**Given:** Achievement with status "pending"
**When:** Verifier approves achievement, user's "My Achievements" page auto-refreshes after 10 seconds
**Then:** User sees status changed to "verified", "Claim Certificate" button appears


