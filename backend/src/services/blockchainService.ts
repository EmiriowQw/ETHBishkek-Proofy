import { ethers } from "ethers";
import { Certificate } from "../models/Certificate";

export class BlockchainService {
  private provider: ethers.providers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private gaslessMinter: ethers.Contract;

  constructor() {
    this.provider = new ethers.providers.JsonRpcProvider(process.env.STATUS_RPC_URL);
    this.wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, this.provider);
    
    // GaslessMinter contract ABI
    const gaslessMinterABI = [
      "function gaslessMint(address user, string memory courseId, string memory courseName, string memory studentName, string memory tokenURI, uint256 nonce, bytes memory signature) external",
      "event GaslessMint(address indexed user, uint256 indexed tokenId, string courseId, uint256 nonce)"
    ];

    this.gaslessMinter = new ethers.Contract(
      process.env.GASLESS_MINTER_ADDRESS!,
      gaslessMinterABI,
      this.wallet
    );
  }

  /**
   * Mint certificate NFT using gasless transaction
   */
  async mintCertificate(
    userAddress: string,
    courseId: string,
    courseName: string,
    studentName: string,
    tokenURI: string
  ): Promise<{ tokenId: string; txHash: string }> {
    try {
      // Generate unique nonce
      const nonce = Date.now();
      
      // Create message hash for signature
      const messageHash = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
          ["address", "string", "string", "string", "string", "uint256"],
          [userAddress, courseId, courseName, studentName, tokenURI, nonce]
        )
      );

      // Sign the message
      const signature = await this.wallet.signMessage(ethers.utils.arrayify(messageHash));

      // Call gasless mint function
      const tx = await this.gaslessMinter.gaslessMint(
        userAddress,
        courseId,
        courseName,
        studentName,
        tokenURI,
        nonce,
        signature,
        {
          gasLimit: 500000, // Set gas limit
        }
      );

      console.log(`Gasless mint transaction sent: ${tx.hash}`);

      // Wait for transaction confirmation
      const receipt = await tx.wait();
      console.log(`Transaction confirmed in block: ${receipt.blockNumber}`);

      // Get token ID from event
      const mintEvent = receipt.events?.find(
        (event: any) => event.event === "GaslessMint"
      );

      if (!mintEvent) {
        throw new Error("Mint event not found in transaction receipt");
      }

      const tokenId = mintEvent.args.tokenId.toString();

      return {
        tokenId,
        txHash: tx.hash,
      };
    } catch (error) {
      console.error("Error minting certificate:", error);
      throw new Error(`Failed to mint certificate: ${error}`);
    }
  }

  /**
   * Check if user already has certificate for a course
   */
  async hasCertificateForCourse(userAddress: string, courseId: string): Promise<boolean> {
    try {
      // This would require the CertificateNFT contract ABI
      // For now, we'll check in the database
      const certificate = await Certificate.findOne({
        where: {
          courseId,
          minted: true,
        },
      });

      return !!certificate;
    } catch (error) {
      console.error("Error checking certificate:", error);
      return false;
    }
  }

  /**
   * Get gas price for Status Network
   */
  async getGasPrice(): Promise<ethers.BigNumber> {
    try {
      const gasPrice = await this.provider.getGasPrice();
      console.log(`Current gas price: ${ethers.utils.formatUnits(gasPrice, "gwei")} gwei`);
      return gasPrice;
    } catch (error) {
      console.error("Error getting gas price:", error);
      // Return a default gas price if network call fails
      return ethers.utils.parseUnits("1", "gwei");
    }
  }

  /**
   * Estimate gas for minting transaction
   */
  async estimateGasForMint(
    userAddress: string,
    courseId: string,
    courseName: string,
    studentName: string,
    tokenURI: string,
    nonce: number,
    signature: string
  ): Promise<ethers.BigNumber> {
    try {
      const gasEstimate = await this.gaslessMinter.estimateGas.gaslessMint(
        userAddress,
        courseId,
        courseName,
        studentName,
        tokenURI,
        nonce,
        signature
      );

      // Add 20% buffer to gas estimate
      return gasEstimate.mul(120).div(100);
    } catch (error) {
      console.error("Error estimating gas:", error);
      // Return a default gas limit if estimation fails
      return ethers.BigNumber.from(500000);
    }
  }
}

export const blockchainService = new BlockchainService();
