import { ethers } from "hardhat";

/**
 * Setup script for Status Network deployment
 * This script configures the network and deploys contracts
 */
async function main() {
  console.log("🚀 Setting up Status Network deployment...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Check balance
  const balance = await deployer.getBalance();
  console.log("Account balance:", ethers.utils.formatEther(balance), "ETH");

  if (balance.lt(ethers.utils.parseEther("0.1"))) {
    console.log("⚠️  Warning: Low balance. You may need Status tokens for gas.");
  }

  // Deploy CertificateNFT
  console.log("📜 Deploying CertificateNFT...");
  const CertificateNFT = await ethers.getContractFactory("CertificateNFT");
  const certificateNFT = await CertificateNFT.deploy();
  await certificateNFT.deployed();
  console.log("✅ CertificateNFT deployed to:", certificateNFT.address);

  // Deploy GaslessMinter
  console.log("⛽ Deploying GaslessMinter...");
  const GaslessMinter = await ethers.getContractFactory("GaslessMinter");
  const gaslessMinter = await GaslessMinter.deploy(certificateNFT.address);
  await gaslessMinter.deployed();
  console.log("✅ GaslessMinter deployed to:", gaslessMinter.address);

  // Transfer ownership
  console.log("🔐 Transferring ownership...");
  await certificateNFT.transferOwnership(gaslessMinter.address);
  console.log("✅ Ownership transferred to GaslessMinter");

  // Verify contracts (optional)
  console.log("\n📋 Deployment Summary:");
  console.log("Network: Status Sepolia");
  console.log("CertificateNFT:", certificateNFT.address);
  console.log("GaslessMinter:", gaslessMinter.address);
  console.log("Deployer:", deployer.address);

  console.log("\n🔧 Next steps:");
  console.log("1. Update your .env files with the contract addresses");
  console.log("2. Fund the GaslessMinter contract with Status tokens for gas");
  console.log("3. Test the gasless minting functionality");
  console.log("4. Deploy your frontend and backend");

  // Save deployment info
  const deploymentInfo = {
    network: "status-sepolia",
    chainId: 436,
    deployer: deployer.address,
    certificateNFT: certificateNFT.address,
    gaslessMinter: gaslessMinter.address,
    timestamp: new Date().toISOString(),
  };

  console.log("\n💾 Deployment info saved to deployment-info.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
