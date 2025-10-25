import { ethers } from "hardhat";

/**
 * Script to check contract status and balances
 */
async function main() {
  console.log("🔍 Checking contract status...");

  const CERTIFICATE_NFT_ADDRESS = process.env.CERTIFICATE_NFT_ADDRESS;
  const GASLESS_MINTER_ADDRESS = process.env.GASLESS_MINTER_ADDRESS;

  if (!CERTIFICATE_NFT_ADDRESS || !GASLESS_MINTER_ADDRESS) {
    console.error("❌ Contract addresses not found in environment variables");
    process.exit(1);
  }

  console.log("📋 Contract Addresses:");
  console.log("CertificateNFT:", CERTIFICATE_NFT_ADDRESS);
  console.log("GaslessMinter:", GASLESS_MINTER_ADDRESS);

  try {
    // Get contracts
    const CertificateNFT = await ethers.getContractFactory("CertificateNFT");
    const certificateNFT = CertificateNFT.attach(CERTIFICATE_NFT_ADDRESS);

    const GaslessMinter = await ethers.getContractFactory("GaslessMinter");
    const gaslessMinter = GaslessMinter.attach(GASLESS_MINTER_ADDRESS);

    // Check contract balances
    const certificateBalance = await ethers.provider.getBalance(CERTIFICATE_NFT_ADDRESS);
    const minterBalance = await ethers.provider.getBalance(GASLESS_MINTER_ADDRESS);

    console.log("\n💰 Contract Balances:");
    console.log("CertificateNFT:", ethers.utils.formatEther(certificateBalance), "ETH");
    console.log("GaslessMinter:", ethers.utils.formatEther(minterBalance), "ETH");

    // Check certificate NFT status
    try {
      const totalSupply = await certificateNFT.totalSupply();
      console.log("\n📜 Certificate NFT Status:");
      console.log("Total Supply:", totalSupply.toString());
    } catch (error) {
      console.log("❌ Error checking CertificateNFT:", error);
    }

    // Check gasless minter status
    try {
      const owner = await gaslessMinter.owner();
      console.log("\n⛽ GaslessMinter Status:");
      console.log("Owner:", owner);
    } catch (error) {
      console.log("❌ Error checking GaslessMinter:", error);
    }

    // Check network status
    const network = await ethers.provider.getNetwork();
    console.log("\n🌐 Network Status:");
    console.log("Network:", network.name);
    console.log("Chain ID:", network.chainId);

    // Check gas price
    const gasPrice = await ethers.provider.getGasPrice();
    console.log("Gas Price:", ethers.utils.formatUnits(gasPrice, "gwei"), "gwei");

    // Check latest block
    const latestBlock = await ethers.provider.getBlockNumber();
    console.log("Latest Block:", latestBlock);

    console.log("\n✅ Contract status check completed!");

  } catch (error) {
    console.error("❌ Error checking contracts:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });
