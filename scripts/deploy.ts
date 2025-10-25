import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying Certificate NFT contracts...");

  // Get the contract factories
  const CertificateNFT = await ethers.getContractFactory("CertificateNFT");
  const GaslessMinter = await ethers.getContractFactory("GaslessMinter");

  // Deploy CertificateNFT
  console.log("📜 Deploying CertificateNFT...");
  const certificateNFT = await CertificateNFT.deploy();
  await certificateNFT.deployed();
  console.log("✅ CertificateNFT deployed to:", certificateNFT.address);

  // Deploy GaslessMinter
  console.log("⛽ Deploying GaslessMinter...");
  const gaslessMinter = await GaslessMinter.deploy(certificateNFT.address);
  await gaslessMinter.deployed();
  console.log("✅ GaslessMinter deployed to:", gaslessMinter.address);

  // Transfer ownership of CertificateNFT to GaslessMinter
  console.log("🔐 Transferring ownership...");
  await certificateNFT.transferOwnership(gaslessMinter.address);
  console.log("✅ Ownership transferred to GaslessMinter");

  console.log("\n🎉 Deployment completed successfully!");
  console.log("📋 Contract addresses:");
  console.log("CertificateNFT:", certificateNFT.address);
  console.log("GaslessMinter:", gaslessMinter.address);
  console.log("\n📝 Add these addresses to your .env file:");
  console.log(`NEXT_PUBLIC_CERTIFICATE_NFT_ADDRESS=${certificateNFT.address}`);
  console.log(`NEXT_PUBLIC_GASLESS_MINTER_ADDRESS=${gaslessMinter.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
