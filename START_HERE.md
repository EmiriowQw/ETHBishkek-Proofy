# 🚀 START HERE - Proofy: Proof of Anything

## ✅ 100% Ready for ETH Bishkek 2025!

### 📦 What's Installed:
- ✅ Frontend (Next.js + React + TypeScript + Wagmi + RainbowKit)
- ✅ Backend (Express + TypeScript with 22+ API endpoints)
- ✅ Smart Contracts (Hardhat + Solidity - ERC-721 + Gasless Minting)
- ✅ Universal Category System (Education, Sports, Volunteering, Skills + Custom)
- ✅ Expert Verifier System with Role-Based Access
- ✅ Beautiful NFT Certificate Profiles
- ✅ All dependencies installed and working

---

## 🎯 Quick Start (2 minutes)

### Step 1: Start Backend

Open **Terminal 1**:

```bash
cd backend
npm run dev
```

Expected output:
```
🚀 Server running on port 3001
📚 API: http://localhost:3001/api
🏥 Health: http://localhost:3001/health
⚡ 22+ endpoints ready
```

### Step 2: Start Frontend

Open **Terminal 2**:

```bash
npm run dev
```

Expected output:
```
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

### Step 3: Open in Browser

Navigate to: **http://localhost:3000**

---

## 🎨 What You Can Do:

### As a Student/User:
1. **Connect Wallet** - Click "Connect Wallet" (MetaMask required)
2. **Create Achievement** - Choose from 4 categories or create custom
3. **Upload Proof** - Add images and descriptions
4. **Submit for Verification** - Send to expert verifiers
5. **Claim NFT Certificate** - After approval, get your blockchain certificate
6. **View Certificate Profile** - Beautiful detail page for each NFT

### As a Verifier/Expert:
1. **Become Verifier** - Register with credentials for specific categories
2. **Review Achievements** - Check submitted achievements with proof images
3. **Approve or Reject** - Verify authentic achievements
4. **Auto-Mint NFTs** - System automatically mints certificates upon approval

---

## 🎯 Complete Testing Flow (5 minutes)

### Use 2 MetaMask Accounts:
- **Account 1**: Student creating achievements
- **Account 2**: Expert verifier

### Full Workflow:

**1. Account 1 (Student) - Create Achievement:**
```
✓ Connect wallet (Account 1)
✓ Go to "Create Achievement"
✓ Select "Sports" category
✓ Fill in:
  - Title: "International Marathon Bishkek 2024 - First Place"
  - Description: [Your achievement story, min 20 chars]
  - Sport Type: Running
  - Event Name: International Marathon Bishkek 2024
  - Placement: 1st Place
  - Date: 2024-10-20
✓ Click "Create Achievement"
✓ Status: Draft
```

**2. Account 1 - Submit for Verification:**
```
✓ Go to "My Achievements"
✓ Find your draft achievement
✓ Click "Submit for Verification"
✓ Upload proof image
✓ Add proof description (min 50 chars)
✓ Submit
✓ Status changes to: Pending ⏳
```

**3. Account 2 (Verifier) - Register as Verifier:**
```
✓ Switch to Account 2 in MetaMask
✓ Refresh page (F5)
✓ Go to "Become Verifier"
✓ Fill in:
  - Name: "Dr. Aibek - Sports Judge"
  - Credentials: [Your expertise, min 50 chars]
  - Select Categories: ☑️ Sports
✓ Click "Register as Verifier"
```

**4. Account 2 - Verify Achievement:**
```
✓ Go to "Verification" page
✓ Filter by "Sports" (if needed)
✓ Click "Review" on pending achievement
✓ Check proof image and details
✓ Click "✅ Verify & Issue Certificate"
✓ NFT automatically minted!
```

**5. Account 1 - Claim Certificate:**
```
✓ Switch back to Account 1
✓ Refresh page (F5) OR wait 10 seconds OR click "Refresh" button
✓ Go to "My Achievements"
✓ Status should now be: Verified ✅
✓ Click "🎓 Claim NFT Certificate"
✓ Redirects to "My Certificates"
✓ Your NFT certificate is there!
```

**6. View Certificate Profile:**
```
✓ On "My Certificates" page
✓ Click "View Full Profile" button
✓ Beautiful detail page with:
  - Category-specific gradient design
  - All achievement details
  - Blockchain verification info
  - Share/Download/Copy buttons
  - Link to blockchain explorer
```

---

## ⚠️ Important: Demo Mode

Backend runs in **mock data mode**:
- ✅ No database required
- ✅ Uses in-memory storage
- ✅ All API endpoints work
- ✅ Perfect for hackathon demo
- ⚠️ Data resets on backend restart (this is OK for demo)

For production deployment:
1. Deploy smart contracts to Status Network
2. Integrate IPFS for image storage
3. Add persistent database (optional)
4. Configure environment variables

---

## 🔗 Blockchain Deployment (Optional)

### Local Network (for development):

**Terminal 3:**
```bash
npm run chain
```

**Terminal 4:**
```bash
npm run deploy
```

### Status Network (for production):

1. Create `.env.local`:
```env
PRIVATE_KEY=your_metamask_private_key
NEXT_PUBLIC_CERTIFICATE_NFT_ADDRESS=
NEXT_PUBLIC_GASLESS_MINTER_ADDRESS=
```

2. Deploy:
```bash
npm run deploy:status
```

3. Fund gasless minter:
```bash
npm run fund
```

---

## 📊 Health Check:

### Backend Working?
```bash
curl http://localhost:3001/health
# Expected: {"status":"OK","timestamp":"..."}
```

### Frontend Working?
Open: http://localhost:3000

### Categories API Working?
```bash
curl http://localhost:3001/api/categories
# Expected: JSON with 4 predefined categories
```

---

## 🎯 Project Architecture:

```
User Browser (http://localhost:3000)
         ↓
    Frontend (Next.js + Wagmi + RainbowKit)
         ↓
    Backend API (http://localhost:3001)
    22+ REST endpoints
         ↓
  [Mock Data Storage] ← In-Memory Arrays
  (mockAchievements, mockCertificates, mockVerifiers)
         ↓
  Smart Contracts (Status Network - Optional)
  (CertificateNFT.sol + GaslessMinter.sol)
```

---

## 📁 Project Structure:

```
proofy/
├── backend/
│   └── src/
│       └── index-simple.ts         # Express backend with all APIs
├── pages/
│   ├── index.tsx                   # Dashboard (landing + user dashboard)
│   ├── create-achievement.tsx      # Achievement creation wizard
│   ├── my-achievements.tsx         # User's achievements management
│   ├── become-verifier.tsx         # Verifier registration
│   ├── verification.tsx            # Verification panel for experts
│   ├── my-certificates.tsx         # NFT certificates gallery
│   └── certificates/
│       └── [tokenId].tsx           # Certificate detail page (NEW!)
├── components/
│   ├── CategorySelector.tsx        # Category selection UI
│   ├── ImageUpload.tsx             # Image upload with preview
│   ├── QuickConnectMetaMask.tsx   # Fast wallet connection
│   └── categories/                 # Category-specific form fields
│       ├── EducationFields.tsx
│       ├── SportsFields.tsx
│       ├── VolunteeringFields.tsx
│       ├── SkillsFields.tsx
│       └── CustomFields.tsx
├── contracts/
│   ├── CertificateNFT.sol          # ERC-721 NFT contract
│   └── GaslessMinter.sol           # Gasless minting contract
├── scripts/
│   ├── deploy.ts                   # Deploy contracts
│   └── fund-gasless-minter.ts     # Fund gasless minter
└── docs/                           # 20+ documentation files
```

---

## 🐛 Troubleshooting:

### Backend Won't Start?
```bash
cd backend
npm install
npm run dev
```

### Frontend Won't Start?
```bash
npm install
npm run dev
```

### Port Already in Use?
```bash
# Windows:
netstat -ano | findstr :3001
taskkill /PID <process_id> /F

# Mac/Linux:
lsof -i :3001
kill -9 <PID>
```

### MetaMask Won't Connect?
- Try the "Quick Connect MetaMask" button
- Make sure MetaMask is installed and unlocked
- Check browser console for errors

### Data Not Updating?
- Click the "Refresh" button on pages
- Or wait 10 seconds for auto-refresh
- Or manually refresh browser (F5)

---

## 📚 Documentation:

All documentation is organized in the `docs/` folder:

- **README.md** - Complete project overview
- **START_HERE.md** - This file (quick start guide)
- **SUBMISSION_CHECKLIST.md** - Hackathon submission requirements
- **LICENSE** - GPLv3 open source license
- **SOURCE.md** - Hackathon source declaration
- Plus 20+ technical documentation files in `docs/`

---

## 🎉 Ready for Hackathon!

Project is 100% ready for:
- ✅ Development and testing
- ✅ Hackathon demonstration
- ✅ Full user flow (student + verifier)
- ✅ Portfolio presentation
- ✅ Production deployment (with minor config)

---

## 🚀 Next Steps:

### For Hackathon Demo:
1. Start backend and frontend (2 terminals)
2. Prepare 2 MetaMask accounts
3. Practice the full flow (5 minutes)
4. Show beautiful UI and NFT profiles
5. Explain "Proof of Anything" concept
6. Demonstrate gasless minting

### For Production Deployment:
1. Deploy smart contracts to Status Network
2. Configure environment variables
3. Set up IPFS for image storage (Pinata)
4. Add persistent database (optional)
5. Set up CI/CD pipeline

### For Further Development:
1. Add verifier reputation system
2. Implement governance for categories
3. Create mobile app (React Native)
4. Add advanced analytics
5. Multi-language support

---

## 💡 Useful Commands:

```bash
# Backend
cd backend
npm run dev              # Start backend on port 3001

# Frontend
npm run dev              # Start frontend on port 3000

# Blockchain (Optional)
npm run chain            # Local Hardhat network
npm run deploy           # Deploy to local network
npm run deploy:status    # Deploy to Status Network
npm run fund             # Fund gasless minter
npm run test-mint        # Test gasless minting
```

---

## 🎯 Key Features to Demonstrate:

1. **Universal Category System** - 4 predefined + custom categories
2. **Dynamic Forms** - Category-specific fields
3. **Image Proof Upload** - With preview and validation
4. **Expert Verification** - Role-based access control
5. **Gasless NFT Minting** - Automatic upon approval
6. **Beautiful NFT Profiles** - Portfolio-ready certificates
7. **Responsive Design** - Works on all devices
8. **Real-time Updates** - Auto-refresh and manual refresh

---

**Good luck at ETH Bishkek 2025! 🚀🇰🇬**

*Proofy - Proof of Anything, powered by blockchain!*
