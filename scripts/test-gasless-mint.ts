import { ethers } from "hardhat";

/**
 * Test script for gasless minting functionality
 * This script tests the gasless minting process
 */
async function main() {
  console.log("🧪 Testing gasless minting functionality...");

  const CERTIFICATE_NFT_ADDRESS = process.env.CERTIFICATE_NFT_ADDRESS;
  const GASLESS_MINTER_ADDRESS = process.env.GASLESS_MINTER_ADDRESS;

  if (!CERTIFICATE_NFT_ADDRESS || !GASLESS_MINTER_ADDRESS) {
    console.error("❌ Contract addresses not found in environment variables");
    process.exit(1);
  }

  const [deployer, user] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);
  console.log("User:", user.address);

  // Get contracts
  const CertificateNFT = await ethers.getContractFactory("CertificateNFT");
  const certificateNFT = CertificateNFT.attach(CERTIFICATE_NFT_ADDRESS);

  const GaslessMinter = await ethers.getContractFactory("GaslessMinter");
  const gaslessMinter = GaslessMinter.attach(GASLESS_MINTER_ADDRESS);

  // Test data
  const testData = {
    user: user.address,
    courseId: "test-course-1",
    courseName: "Test Course",
    studentName: "Test Student",
    tokenURI: "https://ipfs.io/ipfs/test-metadata-hash",
    nonce: Date.now(),
  };

  console.log("\n📋 Test Data:");
  console.log("User:", testData.user);
  console.log("Course ID:", testData.courseId);
  console.log("Course Name:", testData.courseName);
  console.log("Student Name:", testData.studentName);
  console.log("Token URI:", testData.tokenURI);
  console.log("Nonce:", testData.nonce);

  try {
    // Create message hash
    const messageHash = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ["address", "string", "string", "string", "string", "uint256"],
        [testData.user, testData.courseId, testData.courseName, testData.studentName, testData.tokenURI, testData.nonce]
      )
    );

    // Sign the message
    const signature = await deployer.signMessage(ethers.utils.arrayify(messageHash));
    console.log("✅ Message signed");

    // Get gas price
    const gasPrice = await ethers.provider.getGasPrice();
    console.log("⛽ Gas price:", ethers.utils.formatUnits(gasPrice, "gwei"), "gwei");

    // Estimate gas
    const gasEstimate = await gaslessMinter.estimateGas.gaslessMint(
      testData.user,
      testData.courseId,
      testData.courseName,
      testData.studentName,
      testData.tokenURI,
      testData.nonce,
      signature
    );

    console.log("📊 Estimated gas:", gasEstimate.toString());

    // Calculate gas cost
    const gasCost = gasEstimate.mul(gasPrice);
    console.log("💰 Estimated gas cost:", ethers.utils.formatEther(gasCost), "ETH");

    // Check if contract has enough balance
    const contractBalance = await ethers.provider.getBalance(GASLESS_MINTER_ADDRESS);
    console.log("💰 Contract balance:", ethers.utils.formatEther(contractBalance), "ETH");

    if (contractBalance.lt(gasCost)) {
      console.log("⚠️  Warning: Contract may not have enough balance for gas");
    }

    // Execute gasless mint
    console.log("\n🚀 Executing gasless mint...");
    const tx = await gaslessMinter.gaslessMint(
      testData.user,
      testData.courseId,
      testData.courseName,
      testData.studentName,
      testData.tokenURI,
      testData.nonce,
      signature,
      {
        gasLimit: gasEstimate.mul(120).div(100), // Add 20% buffer
      }
    );

    console.log("📤 Transaction sent:", tx.hash);
    console.log("⏳ Waiting for confirmation...");

    const receipt = await tx.wait();
    console.log("✅ Transaction confirmed in block:", receipt.blockNumber);

    // Get token ID from event
    const mintEvent = receipt.events?.find((event: any) => event.event === "GaslessMint");
    if (mintEvent) {
      const tokenId = mintEvent.args.tokenId.toString();
      console.log("🎉 Certificate minted successfully!");
      console.log("Token ID:", tokenId);
      console.log("Gas used:", receipt.gasUsed.toString());
      console.log("Gas price:", ethers.utils.formatUnits(receipt.effectiveGasPrice, "gwei"), "gwei");
      console.log("Total cost:", ethers.utils.formatEther(receipt.gasUsed.mul(receipt.effectiveGasPrice)), "ETH");
    }

    // Verify certificate data
    const certificateData = await certificateNFT.getCertificateData(1);
    console.log("\n📜 Certificate Data:");
    console.log("Course ID:", certificateData.courseId);
    console.log("Course Name:", certificateData.courseName);
    console.log("Student Name:", certificateData.studentName);
    console.log("Completion Date:", new Date(Number(certificateData.completionDate) * 1000).toISOString());
    console.log("Token URI:", certificateData.tokenURI);

    console.log("\n🎉 Gasless minting test completed successfully!");

  } catch (error) {
    console.error("❌ Test failed:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });
