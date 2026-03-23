export const validationABI = [
    {
      "inputs": [
        { "internalType": "address", "name": "_identityRegistry", "type": "address" },
        { "internalType": "address", "name": "_validatorBackend", "type": "address" }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        { "internalType": "bool", "name": "_approved", "type": "bool" },
        { "internalType": "bytes", "name": "_signature", "type": "bytes" }
      ],
      "name": "submitValidationSignature",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "uint256", "name": "", "type": "uint256" }
      ],
      "name": "isAgentVerified",
      "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "validatorBackend",
      "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "identityRegistry",
      "outputs": [{ "internalType": "contract ITRECIdentity", "name": "", "type": "address" }],
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
      "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" },
        { "indexed": false, "internalType": "bool", "name": "status", "type": "bool" }
      ],
      "name": "AgentVerified",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "eip712Domain",
      "outputs": [
        { "internalType": "bytes1", "name": "fields", "type": "bytes1" },
        { "internalType": "string", "name": "name", "type": "string" },
        { "internalType": "string", "name": "version", "type": "string" },
        { "internalType": "uint256", "name": "chainId", "type": "uint256" },
        { "internalType": "address", "name": "verifyingContract", "type": "address" },
        { "internalType": "bytes32", "name": "salt", "type": "bytes32" },
        { "internalType": "uint256[]", "name": "extensions", "type": "uint256[]" }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ] as const;