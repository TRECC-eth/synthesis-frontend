// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Interfaces to talk to your ERC-8004 Identity & Reputation system
interface ITRECIdentity {
    function operatorToAgentId(address operator) external view returns (uint256);
}

interface ITRECReputation {
    function recordBorrow(uint256 _tokenId, uint256 _amount) external;
    function recordRepayment(uint256 _tokenId, uint256 _amount) external;
    function recordLiquidation(uint256 _tokenId) external;
}

contract TRECVault is Ownable {
    IERC20 public usdcToken;
    ITRECIdentity public identityRegistry;
    ITRECReputation public reputationRegistry;

    // Tracking Lender's money
    mapping(address => uint256) public lenderDeposits;
    uint256 public totalPoolLiquidity;

    // Tracking Staker's money (The Borrowers/Operators)
    mapping(address => uint256) public borrowerBonds;
    
    // Tracking loans by the Agent's ERC-8004 Token ID
    mapping(uint256 => uint256) public activeLoans;

    event Deposited(address indexed lender, uint256 amount);
    event BondStaked(address indexed operator, uint256 amount);
    event LoanIssued(uint256 indexed agentId, address indexed mpcWallet, uint256 amount);
    event LoanRepaid(uint256 indexed agentId, uint256 amount);
    event Liquidated(uint256 indexed agentId, uint256 slashedAmount);

    constructor(address _usdcAddress, address _identityAddress, address _reputationAddress) Ownable(msg.sender) {
        usdcToken = IERC20(_usdcAddress);
        identityRegistry = ITRECIdentity(_identityAddress);
        reputationRegistry = ITRECReputation(_reputationAddress);
    }

    // --- 1. LENDER FLOW ---
    function depositLiquidity(uint256 _amount) external {
        require(_amount > 0, "Deposit must be > 0");
        require(usdcToken.transferFrom(msg.sender, address(this), _amount), "Transfer failed");
        
        lenderDeposits[msg.sender] += _amount;
        totalPoolLiquidity += _amount;
        emit Deposited(msg.sender, _amount);
    }

    // --- 2. OPERATOR / AGENT FLOW ---
    // Human operator stakes ETH safety bond
    function stakeBond() external payable {
        require(msg.value > 0, "Must stake some ETH");
        borrowerBonds[msg.sender] += msg.value;
        emit BondStaked(msg.sender, msg.value);
    }

    // Vault issues USDC to the CDP AgentKit MPC Wallet
    function issueLoan(address _operator, address _agentMpcWallet, uint256 _loanAmount) external onlyOwner {
        require(borrowerBonds[_operator] > 0, "Operator has no safety bond");
        require(totalPoolLiquidity >= _loanAmount, "Not enough USDC in pool");
        
        uint256 agentId = identityRegistry.operatorToAgentId(_operator);
        require(agentId != 0, "Operator has no verified Agent ID");

        // Update vault states
        activeLoans[agentId] += _loanAmount;
        totalPoolLiquidity -= _loanAmount;

        // Send USDC directly to the Agent's executing wallet
        require(usdcToken.transfer(_agentMpcWallet, _loanAmount), "Loan transfer failed");
        
        // PUSH TO ERC-8004 REPUTATION REGISTRY
        reputationRegistry.recordBorrow(agentId, _loanAmount);
        
        emit LoanIssued(agentId, _agentMpcWallet, _loanAmount);
    }

    // THE MISSING PIECE: Agent autonomously repays the loan + profit
    function repayLoan(uint256 _agentId, uint256 _repayAmount) external {
        require(activeLoans[_agentId] > 0, "No active loan");
        require(_repayAmount > 0, "Repay amount must be > 0");

        // Pull USDC from the Agent MPC wallet back to the Vault
        require(usdcToken.transferFrom(msg.sender, address(this), _repayAmount), "Repayment failed");

        // Decrease active loan balance (prevent underflow)
        if (_repayAmount >= activeLoans[_agentId]) {
            activeLoans[_agentId] = 0; 
        } else {
            activeLoans[_agentId] -= _repayAmount;
        }

        totalPoolLiquidity += _repayAmount;

        // PUSH TO ERC-8004 REPUTATION REGISTRY (Increases Credit Score!)
        reputationRegistry.recordRepayment(_agentId, _repayAmount);

        emit LoanRepaid(_agentId, _repayAmount);
    }

    // --- 3. THE EMERGENCY BRAKE ---
    // Slashing the bond if the agent loses the money
    function slashAndRecover(address _operator, uint256 _shortfallAmount) external onlyOwner {
        uint256 agentId = identityRegistry.operatorToAgentId(_operator);
        require(activeLoans[agentId] > 0, "No active loan");
        
        // Slash the human's staked ETH
        borrowerBonds[_operator] -= _shortfallAmount; 
        activeLoans[agentId] = 0;
        
        // PUSH TO ERC-8004 REPUTATION REGISTRY (Destroys Credit Score!)
        reputationRegistry.recordLiquidation(agentId);
        
        emit Liquidated(agentId, _shortfallAmount);
    }
}