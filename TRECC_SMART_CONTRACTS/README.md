# TRECC Protocol — Smart Contracts

An autonomous AI agent financial system built on Ethereum. AI agents (identified by soulbound NFTs) can borrow USDC from a lending pool, with human operators posting ETH bonds as collateral and an on-chain reputation system tracking credit history.

---

## Architecture Overview

```mermaid
graph TD
    subgraph Identity["Identity & KYC"]
        IR[TRECIdentityRegistry\nSoulbound NFT]
        VR[TRECValidationRegistry\nEIP-712 KYC]
    end

    subgraph Financial["Financial Layer"]
        V[TRECVault\nLending Pool]
        RR[TRECReputationRegistry\nCredit Scoring]
        USDC[MockUSDC\nERC-20]
    end

    subgraph Actors["Actors"]
        OP[Operator\nHuman EOA]
        AG[Agent MPC Wallet\nAI Autonomous]
        LN[Lender]
        OW[Protocol Owner]
        BE[Off-chain Backend\nKYC Signer]
    end

    BE -- "EIP-712 signature" --> VR
    OP -- "registerAgent()" --> IR
    OP -- "submitValidationSignature()" --> VR
    VR -- "operatorToAgentId()" --> IR

    LN -- "depositLiquidity()" --> V
    OP -- "stakeBond() ETH" --> V

    OW -- "issueLoan()" --> V
    V -- "USDC transfer" --> AG
    V -- "recordBorrow()" --> RR

    AG -- "repayLoan()" --> V
    V -- "recordRepayment()" --> RR

    OW -- "slashAndRecover()" --> V
    V -- "recordLiquidation()" --> RR

    V --> USDC
```

---

## Contract Descriptions

### `TRECIdentityRegistry` — Soulbound NFT Identity

Each AI agent/operator pair gets a unique soulbound NFT (non-transferable). This token ID is the primary key used across the entire protocol.

```mermaid
sequenceDiagram
    participant Op as Operator
    participant IR as TRECIdentityRegistry

    Op->>IR: registerAgent(ensName, metadataURI)
    IR-->>Op: mint NFT (tokenId)
    IR-->>IR: operatorToAgentId[Op] = tokenId
    Note over IR: Transfer blocked (soulbound)
```

**Key functions:**
- `registerAgent(string _ensName, string _metadataURI)` — Mints a soulbound NFT to the caller. Reverts if already registered.

---

### `TRECValidationRegistry` — EIP-712 KYC Verification

Bridges off-chain KYC checks to on-chain verification using EIP-712 typed signatures. A trusted backend signs approvals; operators submit them on-chain.

```mermaid
sequenceDiagram
    participant Op as Operator
    participant BE as Backend Signer
    participant VR as TRECValidationRegistry
    participant IR as TRECIdentityRegistry

    BE-->>Op: sign EIP-712 KYCApproval(operator, true)
    Op->>VR: submitValidationSignature(approved, signature)
    VR->>IR: operatorToAgentId(Op) → tokenId
    VR-->>VR: recoverSigner == validatorBackend?
    VR-->>VR: isAgentVerified[tokenId] = true
    VR-->>Op: emit AgentVerified(tokenId, true)
```

**Key functions:**
- `submitValidationSignature(bool _approved, bytes _signature)` — Verifies EIP-712 signature and sets the agent's verified status.

---

### `TRECReputationRegistry` — On-Chain Credit Scoring

Maintains a financial reputation profile for each agent. Only authorized vaults can write to it.

```mermaid
graph LR
    V[TRECVault] -- "recordBorrow()" --> RR
    V -- "recordRepayment()" --> RR
    V -- "recordLiquidation()" --> RR

    RR --> P["FinancialProfile\n───────────────\ncreditScore\ntotalBorrowed\ntotalRepaid\nliquidations"]
```

**Credit score rules:**

| Event | Score Change |
|---|---|
| Repayment | +1 |
| Liquidation | -50 (min 0) |

**Key functions:**
- `recordBorrow(tokenId, amount)` — Called by vault on loan issuance.
- `recordRepayment(tokenId, amount)` — Called by vault on repayment. Increments credit score.
- `recordLiquidation(tokenId)` — Called by vault on slash. Decrements credit score by 50.
- `setVaultAuthorization(vault, status)` — Owner grants/revokes vault write access.

---

### `TRECVault` — Core Lending Vault

The central financial hub. Lenders deposit USDC, operators stake ETH bonds, and the protocol issues USDC loans to AI agent MPC wallets.

```mermaid
sequenceDiagram
    participant LN as Lender
    participant Op as Operator
    participant OW as Protocol Owner
    participant V as TRECVault
    participant AG as Agent MPC Wallet
    participant RR as ReputationRegistry

    LN->>V: depositLiquidity(amount) [USDC]
    Op->>V: stakeBond() [ETH]

    OW->>V: issueLoan(operator, agentMpcWallet, amount)
    V->>AG: transfer USDC
    V->>RR: recordBorrow(agentId, amount)

    AG->>V: repayLoan(agentId, amount) [USDC]
    V->>RR: recordRepayment(agentId, amount)

    OW->>V: slashAndRecover(operator, shortfall)
    V-->>V: slash ETH bond
    V->>RR: recordLiquidation(agentId)
```

**Key functions:**

| Function | Access | Description |
|---|---|---|
| `depositLiquidity(amount)` | Public | Lenders deposit USDC into the pool |
| `stakeBond()` | Public payable | Operators post ETH collateral |
| `issueLoan(operator, agentMpcWallet, amount)` | Owner only | Protocol sends USDC to agent's MPC wallet |
| `repayLoan(agentId, amount)` | Public | Anyone can repay; AI agent calls this autonomously |
| `slashAndRecover(operator, shortfall)` | Owner only | Slashes operator ETH bond, records liquidation |

---

### `MockUSDC` — Test Stablecoin

A minimal ERC-20 used in place of real USDC for testing and development. Deploys with 1,000,000 tokens minted to the deployer, with a public `mint()` for easy test setup.

---

## Full Protocol Flow

```mermaid
flowchart TD
    A([Operator registers]) --> B[TRECIdentityRegistry\nmint soulbound NFT]
    B --> C{KYC required?}
    C -- yes --> D[Backend signs EIP-712]
    D --> E[TRECValidationRegistry\nisAgentVerified = true]
    C -- no --> F

    E --> F[Operator stakes ETH bond\nTRECVault.stakeBond]
    G([Lender deposits USDC]) --> H[TRECVault\ntotalPoolLiquidity++]

    F --> I[Protocol issues loan\nTRECVault.issueLoan]
    H --> I
    I --> J[USDC to Agent MPC Wallet]
    I --> K[ReputationRegistry\ntotalBorrowed++]

    J --> L{Agent repays?}
    L -- yes --> M[TRECVault.repayLoan\ncreditScore +1]
    L -- no --> N[Protocol liquidates\nTRECVault.slashAndRecover\ncreditScore -50]
```

---

## Deployed Contracts (Sepolia Testnet)

| Contract | Address |
|---|---|
| MockUSDC | `0x17cCeBc2960F50042Fb8f64c18478f083FF0ACDc` |
| TRECIdentityRegistry | `0x5e8c8f67f9Ee0115F7Dc32deA8c7258b4690b55A` |
| TRECReputationRegistry | `0xfB81bCA7966A12F9dD367EE1DBd32d1a50047DD3` |
| TRECValidationRegistry | `0x9F7e8DFEC3d9871F6ff896E7c429E7968E1Ba347` |
| TRECVault | `0xD198499F21BAab91FEe2C02D024Edede66D9334a` |

---

## Development

### Prerequisites

- Node.js 18+
- A `.env` file based on `.env.eg`

```bash
cp .env.eg .env
# Fill in PRIVATE_KEY, SEPOLIA_RPC_URL, etc.
```

### Install & Compile

```bash
npm install
npx hardhat compile
```

### Run Tests

```bash
npx hardhat test
```

### Deploy

```bash
# Sepolia
npx hardhat ignition deploy ignition/modules/TRECC.ts --network sepolia

# Base Sepolia
npx hardhat ignition deploy ignition/modules/TRECC.ts --network baseSepolia
```

---

## Tech Stack

- **Solidity** `0.8.24` (EVM: Cancun)
- **Hardhat** `2.28.6` + Ignition
- **OpenZeppelin Contracts** `^5.6.1`
- **TypeScript** + TypeChain
- **EIP-712** typed structured data signing
