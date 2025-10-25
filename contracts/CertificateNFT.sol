// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title CertificateNFT
 * @dev ERC-721 NFT contract for course completion certificates
 * @notice This contract allows gasless minting of certificates for completed courses
 */
contract CertificateNFT is ERC721, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIdCounter;
    
    // Mapping from token ID to certificate metadata
    mapping(uint256 => CertificateData) public certificates;
    
    // Mapping to track if user has already received certificate for a course
    mapping(address => mapping(string => bool)) public userCourseCertificates;
    
    // Events
    event CertificateMinted(
        address indexed to,
        uint256 indexed tokenId,
        string courseId,
        string courseName,
        string studentName,
        uint256 completionDate
    );
    
    // Struct for certificate data
    struct CertificateData {
        string courseId;
        string courseName;
        string studentName;
        uint256 completionDate;
        string tokenURI;
    }
    
    constructor() ERC721("Course Completion Certificate", "CERT") {}
    
    /**
     * @dev Mint a certificate NFT for a completed course
     * @param to The address to mint the certificate to
     * @param courseId Unique identifier for the course
     * @param courseName Name of the course
     * @param studentName Name of the student
     * @param tokenURI IPFS URI containing certificate metadata
     */
    function mintCertificate(
        address to,
        string memory courseId,
        string memory courseName,
        string memory studentName,
        string memory tokenURI
    ) external onlyOwner nonReentrant {
        // Check if user already has certificate for this course
        require(
            !userCourseCertificates[to][courseId],
            "Certificate already exists for this course"
        );
        
        // Increment token ID
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        
        // Store certificate data
        certificates[tokenId] = CertificateData({
            courseId: courseId,
            courseName: courseName,
            studentName: studentName,
            completionDate: block.timestamp,
            tokenURI: tokenURI
        });
        
        // Mark course as completed for this user
        userCourseCertificates[to][courseId] = true;
        
        // Mint the NFT
        _safeMint(to, tokenId);
        
        // Emit event
        emit CertificateMinted(
            to,
            tokenId,
            courseId,
            courseName,
            studentName,
            block.timestamp
        );
    }
    
    /**
     * @dev Get certificate data for a token
     * @param tokenId The token ID
     * @return CertificateData struct containing certificate information
     */
    function getCertificateData(uint256 tokenId) external view returns (CertificateData memory) {
        require(_exists(tokenId), "Token does not exist");
        return certificates[tokenId];
    }
    
    /**
     * @dev Check if user has certificate for a specific course
     * @param user The user address
     * @param courseId The course ID
     * @return bool True if user has certificate for this course
     */
    function hasCertificateForCourse(address user, string memory courseId) external view returns (bool) {
        return userCourseCertificates[user][courseId];
    }
    
    /**
     * @dev Get total number of certificates minted
     * @return uint256 Total number of certificates
     */
    function totalSupply() external view returns (uint256) {
        return _tokenIdCounter.current();
    }
    
    /**
     * @dev Override tokenURI to return custom metadata
     * @param tokenId The token ID
     * @return string The token URI
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        return certificates[tokenId].tokenURI;
    }
    
    /**
     * @dev Get all certificates for a user
     * @param user The user address
     * @return uint256[] Array of token IDs owned by the user
     */
    function getUserCertificates(address user) external view returns (uint256[] memory) {
        uint256 balance = balanceOf(user);
        uint256[] memory tokenIds = new uint256[](balance);
        uint256 index = 0;
        
        for (uint256 i = 1; i <= _tokenIdCounter.current(); i++) {
            if (ownerOf(i) == user) {
                tokenIds[index] = i;
                index++;
            }
        }
        
        return tokenIds;
    }
}
