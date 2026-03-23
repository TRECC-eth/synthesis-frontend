// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface ITRECIdentity {
    function operatorToAgentId(address operator) external view returns (uint256);
}

contract TRECValidationRegistry is EIP712, Ownable {
    ITRECIdentity public identityRegistry;
    address public validatorBackend; 

    bytes32 private constant KYC_TYPEHASH = keccak256("KYCApproval(address user,bool approved)");
    
    // tokenId => bool
    mapping(uint256 => bool) public isAgentVerified;

    event AgentVerified(uint256 indexed tokenId, bool status);

    constructor(address _identityRegistry, address _validatorBackend) 
        EIP712("TRECValidation", "1") 
        Ownable(msg.sender) 
    {
        identityRegistry = ITRECIdentity(_identityRegistry);
        validatorBackend = _validatorBackend;
    }

    function submitValidationSignature(bool _approved, bytes memory _signature) external {
        uint256 tokenId = identityRegistry.operatorToAgentId(msg.sender);
        require(tokenId != 0, "No Identity found for operator");

        bytes32 structHash = keccak256(abi.encode(KYC_TYPEHASH, msg.sender, _approved));
        bytes32 hash = _hashTypedDataV4(structHash);
        address signer = ECDSA.recover(hash, _signature);
        
        require(signer == validatorBackend, "Invalid Validator Signature");
        
        isAgentVerified[tokenId] = _approved;
        emit AgentVerified(tokenId, _approved);
    }
}