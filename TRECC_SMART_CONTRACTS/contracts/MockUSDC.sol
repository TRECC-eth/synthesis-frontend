// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockUSDC is ERC20 {
    constructor() ERC20("Mock USDC", "mUSDC") {
        // Mint 1,000,000 mUSDC to the wallet that deploys this (you!)
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    // A public mint function so your hackathon judges/testers can get fake USDC too
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}