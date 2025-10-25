# 🚀 Deployment Guide - Proofy NFT

This guide will walk you through deploying the Proofy NFT platform on Status Network.

## 📋 Prerequisites

Before starting, ensure you have:

- [ ] Node.js 18+ installed
- [ ] PostgreSQL database running
- [ ] MetaMask wallet with Status tokens
- [ ] Pinata account for IPFS storage
- [ ] Status Network RPC access

## 🔧 Step 1: Environment Setup

### 1.1 Clone and Install

```bash
git clone <repository-url>
cd proofy-nft
npm install
cd backend && npm install && cd ..
```

### 1.2 Configure Environment Variables

**Frontend (.env.local):**
```env
NEXT_PUBLIC_CERTIFICATE_NFT_ADDRESS=0x...
NEXT_PUBLIC_GASLESS_MINTER_ADDRESS=0x...
NEXT_PUBLIC_ALCHEMY_ID=your_alchemy_api_key
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

**Backend (.env):**
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

## 🏗️ Step 2: Database Setup

### 2.1 Create Database

```bash
# Create PostgreSQL database
createdb proofy_nft

# Or using psql
psql -c "CREATE DATABASE proofy_nft;"
```

### 2.2 Run Migrations

```bash
cd backend
npm run dev
# Database tables will be created automatically
```

## 🔗 Step 3: Smart Contract Deployment

### 3.1 Deploy to Status Sepolia

```bash
# Deploy contracts
npm run deploy:status

# This will deploy:
# - CertificateNFT contract
# - GaslessMinter contract
# - Transfer ownership to GaslessMinter
```

### 3.2 Fund Gasless Minter

```bash
# Fund the contract with Status tokens for gas
npx hardhat run scripts/fund-gasless-minter.ts --network status-sepolia
```

### 3.3 Test Gasless Minting

```bash
# Test the gasless minting functionality
npx hardhat run scripts/test-gasless-mint.ts --network status-sepolia
```

## 🚀 Step 4: Application Deployment

### 4.1 Start Backend

```bash
cd backend
npm run build
npm start
```

### 4.2 Start Frontend

```bash
npm run build
npm start
```

## 🌐 Step 5: Production Deployment

### 5.1 Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### 5.2 Backend (Railway/Heroku)

1. Connect your repository
2. Set environment variables
3. Deploy with PostgreSQL addon

### 5.3 Database (Supabase/PlanetScale)

1. Create database instance
2. Update DATABASE_URL in backend
3. Run migrations

## 🔍 Step 6: Verification

### 6.1 Contract Verification

```bash
# Verify contracts on Status Explorer
npx hardhat verify --network status-sepolia <contract-address>
```

### 6.2 Test Complete Flow

1. **Connect Wallet**: Test wallet connection
2. **Browse Courses**: Verify course listing
3. **Complete Course**: Test course completion
4. **Mint Certificate**: Test gasless minting
5. **View Certificate**: Check NFT in wallet

### 6.3 Check Gasless Transactions

- Verify transactions show 0 gas cost for users
- Check contract balance for gas payments
- Monitor transaction success rate

## 📊 Step 7: Monitoring

### 7.1 Backend Monitoring

```bash
# Check logs
cd backend
npm run logs

# Monitor database
psql proofy_nft -c "SELECT * FROM users;"
```

### 7.2 Blockchain Monitoring

- Monitor contract balance
- Check transaction success rate
- Verify gasless transactions

## 🛠️ Troubleshooting

### Common Issues

#### 1. Contract Deployment Fails

```bash
# Check network connection
npx hardhat console --network status-sepolia

# Verify private key
echo $PRIVATE_KEY
```

#### 2. Database Connection Issues

```bash
# Test database connection
psql $DATABASE_URL -c "SELECT 1;"

# Check environment variables
echo $DATABASE_URL
```

#### 3. IPFS Upload Fails

```bash
# Test Pinata connection
curl -X GET "https://api.pinata.cloud/data/testAuthentication" \
  -H "pinata_api_key: $PINATA_API_KEY" \
  -H "pinata_secret_api_key: $PINATA_SECRET_KEY"
```

#### 4. Gasless Minting Fails

```bash
# Check contract balance
npx hardhat run scripts/check-contract-balance.ts --network status-sepolia

# Fund contract if needed
npx hardhat run scripts/fund-gasless-minter.ts --network status-sepolia
```

### Debug Commands

```bash
# Check contract status
npx hardhat run scripts/check-contracts.ts --network status-sepolia

# Test gasless minting
npx hardhat run scripts/test-gasless-mint.ts --network status-sepolia

# Check database
psql $DATABASE_URL -c "SELECT COUNT(*) FROM users;"
```

## 📈 Performance Optimization

### 1. Database Optimization

```sql
-- Add indexes for better performance
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_certificates_user_id ON certificates(user_id);
CREATE INDEX idx_certificates_course_id ON certificates(course_id);
```

### 2. Caching

```bash
# Enable Redis for session storage
npm install redis
```

### 3. CDN Setup

- Use Cloudflare for static assets
- Enable IPFS gateway caching
- Optimize image uploads

## 🔒 Security Checklist

- [ ] Private keys stored securely
- [ ] Database credentials encrypted
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] JWT tokens properly secured
- [ ] Contract ownership verified

## 📞 Support

If you encounter issues:

1. Check the logs for error messages
2. Verify all environment variables
3. Test each component individually
4. Check Status Network status
5. Contact support team

## 🎯 Next Steps

After successful deployment:

1. **Monitor Performance**: Set up monitoring and alerts
2. **User Testing**: Conduct user acceptance testing
3. **Documentation**: Update API documentation
4. **Marketing**: Prepare for launch
5. **Analytics**: Set up user analytics

---

**Happy Deploying! 🚀**
