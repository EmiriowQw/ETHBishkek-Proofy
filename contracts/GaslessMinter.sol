// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "./CertificateNFT.sol";

/**
 * @title GaslessMinter
 * @dev Contract for gasless minting of certificates
 * @notice This contract allows backend to mint certificates on behalf of users
 */
contract GaslessMinter is Ownable, ReentrancyGuard {
    using ECDSA for bytes32;
    
    CertificateNFT public certificateNFT;
    
    // Mapping to track used nonces to prevent replay attacks
    mapping(uint256 => bool) public usedNonces;
    
    // Events
    event GaslessMint(
        address indexed user,
        uint256 indexed tokenId,
        string courseId,
        uint256 nonce
    );
    
    constructor(address _certificateNFT) {
        certificateNFT = CertificateNFT(_certificateNFT);
    }
    
    /**
     * @dev Mint certificate on behalf of user (gasless)
     * @param user The user address
     * @param courseId Course identifier
     * @param courseName Course name
     * @param studentName Student name
     * @param tokenURI IPFS URI
     * @param nonce Unique nonce to prevent replay attacks
     * @param signature Backend signature for verification
     */
    function gaslessMint(
        address user,
        string memory courseId,
        string memory courseName,
        string memory studentName,
        string memory tokenURI,
        uint256 nonce,
        bytes memory signature
    ) external nonReentrant {
        // Check nonce hasn't been used
        require(!usedNonces[nonce], "Nonce already used");
        
        // Verify signature
        bytes32 messageHash = keccak256(
            abi.encodePacked(
                user,
                courseId,
                courseName,
                studentName,
                tokenURI,
                nonce
            )
        );
        bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();
        address signer = ethSignedMessageHash.recover(signature);
        require(signer == owner(), "Invalid signature");
        
        // Mark nonce as used
        usedNonces[nonce] = true;
        
        // Mint certificate
        certificateNFT.mintCertificate(
            user,
            courseId,
            courseName,
            studentName,
            tokenURI
        );
        
        emit GaslessMint(user, certificateNFT.totalSupply(), courseId, nonce);
    }
    
    /**
     * @dev Update certificate NFT contract address
     * @param _certificateNFT New certificate NFT contract address
     */
    function updateCertificateNFT(address _certificateNFT) external onlyOwner {
        certificateNFT = CertificateNFT(_certificateNFT);
    }
}
