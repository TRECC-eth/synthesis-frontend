export const reputationABI = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        { "internalType": "uint256", "name": "_tokenId", "type": "uint256" },
        { "internalType": "uint256", "name": "_amount", "type": "uint256" }
      ],
      "name": "recordBorrow",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "uint256", "name": "_tokenId", "type": "uint256" },
        { "internalType": "uint256", "name": "_amount", "type": "uint256" }
      ],
      "name": "recordRepayment",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "uint256", "name": "_tokenId", "type": "uint256" }
      ],
      "name": "recordLiquidation",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "uint256", "name": "", "type": "uint256" }
      ],
      "name": "agentReputation",
      "outputs": [
        { "internalType": "uint256", "name": "creditScore", "type": "uint256" },
        { "internalType": "uint256", "name": "totalBorrowed", "type": "uint256" },
        { "internalType": "uint256", "name": "totalRepaid", "type": "uint256" },
        { "internalType": "uint256", "name": "liquidations", "type": "uint256" }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "address", "name": "_vault", "type": "address" },
        { "internalType": "bool", "name": "_status", "type": "bool" }
      ],
      "name": "setVaultAuthorization",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "address", "name": "", "type": "address" }
      ],
      "name": "authorizedVaults",
      "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "address", "name": "newOwner", "type": "address" }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" },
        { "indexed": false, "internalType": "uint256", "name": "newScore", "type": "uint256" }
      ],
      "name": "ReputationUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" },
        { "indexed": false, "internalType": "uint256", "name": "borrowed", "type": "uint256" },
        { "indexed": false, "internalType": "uint256", "name": "repaid", "type": "uint256" }
      ],
      "name": "FinancialActivityRecorded",
      "type": "event"
    }
  ] as const;