// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TRECIdentityRegistry is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    // Links a user's wallet to their specific Agent NFT ID
    mapping(address => uint256) public operatorToAgentId;
    mapping(uint256 => string) public agentEnsNames;

    event AgentRegistered(address indexed owner, uint256 indexed tokenId, string ensName, string metadataURI);

    constructor() ERC721("TREC Agent ID", "TREC") Ownable(msg.sender) {}

    function registerAgent(string memory _ensName, string memory _metadataURI) external {
        require(operatorToAgentId[msg.sender] == 0, "Operator already has an Agent Identity");
        
        _nextTokenId++;
        uint256 tokenId = _nextTokenId;
        
        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, _metadataURI); // Points to your IPFS agent.json
        
        operatorToAgentId[msg.sender] = tokenId;
        agentEnsNames[tokenId] = _ensName;

        emit AgentRegistered(msg.sender, tokenId, _ensName, _metadataURI);
    }

    // --- MAKE IT SOULBOUND ---
    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        address from = _ownerOf(tokenId);
        require(from == address(0) || to == address(0), "TREC Identity is Soulbound!");
        return super._update(to, tokenId, auth);
    }
}