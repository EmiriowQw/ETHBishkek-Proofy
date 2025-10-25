# Proofy NFT - Gasless Certificate Platform

A Web3 platform for issuing NFT certificates for completed online courses with gasless transactions on Status Network.

## 🚀 Features

- **Gasless NFT Minting**: Users can mint certificates without paying gas fees
- **Status Network Integration**: Built for Status Sepolia testnet
- **Course Management**: Complete courses and earn verifiable certificates
- **IPFS Storage**: Certificate metadata and images stored on IPFS
- **Modern UI**: Built with React, TypeScript, and Tailwind CSS
- **Blockchain Verification**: All certificates are blockchain-verified

## 🏗️ Architecture

### Frontend
- **React + TypeScript**: Modern web application
- **Scaffold-ETH**: Web3 development framework
- **RainbowKit**: Wallet connection
- **Tailwind CSS**: Styling

### Backend
- **Node.js + Express**: REST API
- **PostgreSQL**: Database
- **IPFS (Pinata)**: Decentralized storage
- **Ethers.js**: Blockchain interactions

### Smart Contracts
- **ERC-721**: NFT standard for certificates
- **GaslessMinter**: Contract for gasless minting
- **Status Network**: Deployed on Status Sepolia

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL
- MetaMask or compatible wallet
- Status Network RPC access
- Pinata account for IPFS

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd proofy-nft
```

### 2. Install dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 3. Environment Setup

Copy the environment files and configure them:

```bash
# Frontend
cp env.example .env.local

# Backend
cp backend/env.example backend/.env
```

### 4. Database Setup

```bash
# Create PostgreSQL database
createdb proofy_nft

# Run migrations (will be created automatically on first run)
cd backend
npm run dev
```

### 5. Deploy Smart Contracts

```bash
# Deploy to Status Sepolia
npm run deploy:status

# Fund the gasless minter contract
npx hardhat run scripts/fund-gasless-minter.ts --network status-sepolia

# Test gasless minting
npx hardhat run scripts/test-gasless-mint.ts --network status-sepolia
```

## 🚀 Running the Application

### Development Mode

```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend
npm run dev
```

### Production Mode

```bash
# Build and start backend
cd backend
npm run build
npm start

# Build and start frontend
npm run build
npm start
```

## 🔧 Configuration

### Environment Variables

#### Frontend (.env.local)
```env
NEXT_PUBLIC_CERTIFICATE_NFT_ADDRESS=0x...
NEXT_PUBLIC_GASLESS_MINTER_ADDRESS=0x...
NEXT_PUBLIC_ALCHEMY_ID=your_alchemy_api_key
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

#### Backend (.env)
```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/proofy_nft

# Blockchain
PRIVATE_KEY=your_private_key_here
CERTIFICATE_NFT_ADDRESS=0x...
GASLESS_MINTER_ADDRESS=0x...
STATUS_RPC_URL=https://rpc.status.im/

# IPFS
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_KEY=your_pinata_secret_key
IPFS_GATEWAY=https://gateway.pinata.cloud/ipfs/

# Server
PORT=3001
JWT_SECRET=your_jwt_secret_here
CORS_ORIGIN=http://localhost:3000
```

## 📚 API Documentation

### Authentication
- `POST /api/auth/connect` - Connect wallet
- `GET /api/auth/me` - Get current user

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `GET /api/courses/:id/progress` - Get user progress
- `PUT /api/courses/:id/progress` - Update progress

### Certificates
- `POST /api/certificates/mint` - Mint certificate
- `GET /api/certificates/user/:userId` - Get user certificates
- `GET /api/certificates/:tokenId` - Get certificate by token ID

### Users
- `GET /api/users/:id/profile` - Get user profile
- `PUT /api/users/:id/profile` - Update profile

## 🔗 Smart Contracts

### CertificateNFT
- **Address**: Deployed contract address
- **Standard**: ERC-721
- **Functions**:
  - `mintCertificate()` - Mint new certificate
  - `getCertificateData()` - Get certificate metadata
  - `hasCertificateForCourse()` - Check if user has certificate

### GaslessMinter
- **Address**: Deployed contract address
- **Functions**:
  - `gaslessMint()` - Mint certificate without gas fees
  - **Events**: `GaslessMint` - Emitted when certificate is minted

## 🌐 Status Network

### Network Details
- **Name**: Status Sepolia
- **Chain ID**: 436
- **RPC URL**: https://rpc.status.im/
- **Explorer**: https://sepolia.status.im/

### Gasless Transactions
The platform uses a gasless minting system where:
1. Backend signs transactions on behalf of users
2. Contract pays for gas using pre-funded tokens
3. Users receive NFTs without paying gas fees

## 🧪 Testing

### Test Gasless Minting
```bash
npx hardhat run scripts/test-gasless-mint.ts --network status-sepolia
```

### Test Contract Functions
```bash
npx hardhat test
```

## 📦 Deployment

### Smart Contracts
```bash
# Deploy to Status Sepolia
npm run deploy:status

# Verify contracts
npx hardhat verify --network status-sepolia <contract-address>
```

### Frontend
```bash
# Build for production
npm run build

# Deploy to Vercel/Netlify
npm run start
```

### Backend
```bash
# Build and deploy
cd backend
npm run build
npm start
```

## 🔒 Security

- Private keys are stored securely
- JWT tokens for authentication
- Input validation on all endpoints
- Rate limiting for API calls
- CORS configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Join our Discord community
- Check the documentation

## 🎯 Roadmap

- [ ] Social login integration
- [ ] Advanced course management
- [ ] Certificate verification system
- [ ] Mobile app
- [ ] Multi-chain support
- [ ] Advanced analytics

---

**Built with ❤️ for the Web3 community**
