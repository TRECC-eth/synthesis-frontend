// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

contract TRECReputationRegistry is Ownable {
    struct FinancialProfile {
        uint256 creditScore;
        uint256 totalBorrowed;
        uint256 totalRepaid;
        uint256 liquidations;
    }

    mapping(uint256 => FinancialProfile) public agentReputation;
    
    // Allow specific vaults to write to the reputation registry
    mapping(address => bool) public authorizedVaults;

    event ReputationUpdated(uint256 indexed tokenId, uint256 newScore);
    event FinancialActivityRecorded(uint256 indexed tokenId, uint256 borrowed, uint256 repaid);

    constructor() Ownable(msg.sender) {}

    modifier onlyAuthorized() {
        require(authorizedVaults[msg.sender] || msg.sender == owner(), "Not authorized to update reputation");
        _;
    }

    function setVaultAuthorization(address _vault, bool _status) external onlyOwner {
        authorizedVaults[_vault] = _status;
    }

    // Called by TRECVault when an agent successfully repays
    function recordRepayment(uint256 _tokenId, uint256 _amount) external onlyAuthorized {
        agentReputation[_tokenId].totalRepaid += _amount;
        
        // Simple logic: +1 credit score for every successful repayment event
        agentReputation[_tokenId].creditScore += 1; 
        
        emit FinancialActivityRecorded(_tokenId, 0, _amount);
        emit ReputationUpdated(_tokenId, agentReputation[_tokenId].creditScore);
    }

    // Called by TRECVault when an agent takes a loan
    function recordBorrow(uint256 _tokenId, uint256 _amount) external onlyAuthorized {
        agentReputation[_tokenId].totalBorrowed += _amount;
        emit FinancialActivityRecorded(_tokenId, _amount, 0);
    }
    
    // Called by TRECVault if the agent's ETH bond gets slashed
    function recordLiquidation(uint256 _tokenId) external onlyAuthorized {
        agentReputation[_tokenId].liquidations += 1;
        
        // Massive penalty for getting slashed
        if (agentReputation[_tokenId].creditScore > 50) {
            agentReputation[_tokenId].creditScore -= 50; 
        } else {
            agentReputation[_tokenId].creditScore = 0;
        }
        
        emit ReputationUpdated(_tokenId, agentReputation[_tokenId].creditScore);
    }
}