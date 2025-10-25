import { ethers } from "hardhat";

/**
 * Script to check contract balance and funding status
 */
async function main() {
  console.log("💰 Checking contract balance...");

  const GASLESS_MINTER_ADDRESS = process.env.GASLESS_MINTER_ADDRESS;

  if (!GASLESS_MINTER_ADDRESS) {
    console.error("❌ GASLESS_MINTER_ADDRESS not found in environment variables");
    process.exit(1);
  }

  try {
    // Check contract balance
    const balance = await ethers.provider.getBalance(GASLESS_MINTER_ADDRESS);
    const balanceInEth = ethers.utils.formatEther(balance);

    console.log("📊 GaslessMinter Contract Balance:");
    console.log("Address:", GASLESS_MINTER_ADDRESS);
    console.log("Balance:", balanceInEth, "ETH");

    // Check if balance is sufficient for gasless operations
    const minBalance = ethers.utils.parseEther("0.01"); // Minimum 0.01 ETH
    const isSufficient = balance.gte(minBalance);

    console.log("\n🔍 Balance Analysis:");
    console.log("Minimum Required:", ethers.utils.formatEther(minBalance), "ETH");
    console.log("Current Balance:", balanceInEth, "ETH");
    console.log("Status:", isSufficient ? "✅ Sufficient" : "❌ Insufficient");

    if (!isSufficient) {
      console.log("\n⚠️  Warning: Contract balance is too low for gasless operations");
      console.log("💡 Run the funding script to add more tokens:");
      console.log("   npx hardhat run scripts/fund-gasless-minter.ts --network status-sepolia");
    }

    // Estimate gas cost for a typical mint operation
    console.log("\n⛽ Gas Cost Estimation:");
    const gasPrice = await ethers.provider.getGasPrice();
    const estimatedGas = ethers.BigNumber.from("300000"); // Typical gas for minting
    const estimatedCost = gasPrice.mul(estimatedGas);

    console.log("Gas Price:", ethers.utils.formatUnits(gasPrice, "gwei"), "gwei");
    console.log("Estimated Gas per Mint:", estimatedGas.toString());
    console.log("Estimated Cost per Mint:", ethers.utils.formatEther(estimatedCost), "ETH");

    // Calculate how many mints are possible
    const possibleMints = balance.div(estimatedCost);
    console.log("Possible Mints:", possibleMints.toString());

    if (possibleMints.lt(10)) {
      console.log("⚠️  Warning: Low mint capacity. Consider funding the contract.");
    }

    console.log("\n✅ Balance check completed!");

  } catch (error) {
    console.error("❌ Error checking balance:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });
