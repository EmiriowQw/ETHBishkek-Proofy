import { ethers } from "hardhat";

/**
 * Script to fund the GaslessMinter contract with Status tokens
 * This allows the contract to pay for gas on behalf of users
 */
async function main() {
  const GASLESS_MINTER_ADDRESS = process.env.GASLESS_MINTER_ADDRESS;
  
  if (!GASLESS_MINTER_ADDRESS) {
    console.error("❌ GASLESS_MINTER_ADDRESS not found in environment variables");
    process.exit(1);
  }

  console.log("💰 Funding GaslessMinter contract...");
  console.log("Contract address:", GASLESS_MINTER_ADDRESS);

  const [deployer] = await ethers.getSigners();
  console.log("Funding with account:", deployer.address);

  // Check current balance
  const balance = await deployer.getBalance();
  console.log("Account balance:", ethers.utils.formatEther(balance), "ETH");

  // Amount to send (adjust as needed)
  const fundingAmount = ethers.utils.parseEther("0.1"); // 0.1 ETH worth of Status tokens
  
  if (balance.lt(fundingAmount)) {
    console.error("❌ Insufficient balance to fund the contract");
    process.exit(1);
  }

  try {
    // Send Status tokens to the contract
    const tx = await deployer.sendTransaction({
      to: GASLESS_MINTER_ADDRESS,
      value: fundingAmount,
    });

    console.log("📤 Transaction sent:", tx.hash);
    console.log("⏳ Waiting for confirmation...");

    const receipt = await tx.wait();
    console.log("✅ Transaction confirmed in block:", receipt.blockNumber);

    // Check contract balance
    const contractBalance = await ethers.provider.getBalance(GASLESS_MINTER_ADDRESS);
    console.log("💰 Contract balance:", ethers.utils.formatEther(contractBalance), "ETH");

    console.log("\n🎉 GaslessMinter contract funded successfully!");
    console.log("The contract can now pay for gas on behalf of users.");

  } catch (error) {
    console.error("❌ Error funding contract:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });
