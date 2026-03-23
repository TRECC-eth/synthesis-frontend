# TRECC Protocol — Trustless Reputation & Evaluation Credit

> **ERC-8004 AI Agent Lending** — A decentralized lending protocol where mathematically-verified autonomous AI agents can borrow USDC while operators post ETH collateral bonds.

---

## What is TRECC?

TRECC is a trustless lending infrastructure built for the agentic economy. It bridges **capital providers** (lenders) with **autonomous AI agents** (borrowers) using on-chain identity, reputation scoring, and cryptographic KYC — replacing traditional credit checks with verifiable on-chain behavior.

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#6366f1', 'primaryTextColor': '#fff', 'primaryBorderColor': '#4f46e5', 'lineColor': '#a78bfa', 'secondaryColor': '#0f172a', 'tertiaryColor': '#1e1b4b'}}}%%
graph LR
    A["🏦 Capital Provider\n(Lender)"] -->|"Deposits USDC"| B[("🔒 TRECVault\nLending Pool")]
    B -->|"Issues Loan\n(USDC → Coinbase Vault)"| C["🤖 AI Agent\n(ERC-8004)"]
    C -->|"Repays Loan + Interest"| B
    D["👤 Operator"] -->|"Stakes ETH Bond"| B
    D -->|"Registers & Manages"| C
    B -->|"Earns APY"| A
    E["🧾 TRECIdentityRegistry\n(Soulbound NFT)"] -->|"Identity Check"| B
    F["⭐ TRECReputationRegistry\n(Credit Score)"]--->|"Reputation Check"| B
    G["✅ TRECValidationRegistry\n(EIP-712 KYC)"] --->|"KYC Verification"| B

    style A fill:#4f46e5,color:#fff,stroke:#818cf8
    style B fill:#0f172a,color:#a78bfa,stroke:#6366f1
    style C fill:#7c3aed,color:#fff,stroke:#a78bfa
    style D fill:#312e81,color:#e0e7ff,stroke:#6366f1
    style E fill:#1e1b4b,color:#c7d2fe,stroke:#4f46e5
    style F fill:#1e1b4b,color:#c7d2fe,stroke:#4f46e5
    style G fill:#1e1b4b,color:#c7d2fe,stroke:#4f46e5
```

---

## Agent Data Files

| File | Path | Description |
|---|---|---|
| `agent.json` | `TRECC_APP/data/agent.json` | Agent identity and configuration data |
| `agent_log.json` | `TRECC_APP/data/agent_log.json` | Agent activity and interaction logs |

---

## Monorepo Structure

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#0ea5e9', 'primaryTextColor': '#fff', 'primaryBorderColor': '#0284c7', 'lineColor': '#38bdf8', 'secondaryColor': '#0c4a6e', 'tertiaryColor': '#082f49'}}}%%
graph TD
    ROOT["📦 Trecc-synthesis\n(Monorepo Root)"]
    ROOT --> APP["🖥️ TRECC_APP\nNext.js 16 Frontend"]
    ROOT --> SC["🔗 TRECC_SMART_CONTRACTS\nHardhat + Solidity"]

    APP --> PAGES["📄 app/\nApp Router Pages"]
    APP --> COMPS["🧩 components/\nReact Components"]
    APP --> HOOKS["🪝 hooks/\nCustom Hooks"]
    APP --> LIB["📚 lib/\nUtilities"]
    APP --> CONSTS["🗂️ constants/\nABIs & Addresses"]
    APP --> CONFIG["⚙️ config/\nWagmi / Reown"]

    SC --> CONTRACTS["📜 contracts/\nSolidity Files"]
    SC --> IGNITION["🚀 ignition/\nDeployment Modules"]
    SC --> TESTS["🧪 test/\nHardhat Tests"]
    SC --> SCRIPTS["🔧 scripts/\nUtility Scripts"]

    CONTRACTS --> V["TRECVault.sol"]
    CONTRACTS --> IR["TRECIdentityRegistry.sol"]
    CONTRACTS --> RR["TRECReputationRegistry.sol"]
    CONTRACTS --> VR["TRECValidationRegistry.sol"]
    CONTRACTS --> USDC["MockUSDC.sol"]

    style ROOT fill:#0c4a6e,color:#e0f2fe,stroke:#0284c7
    style APP fill:#0369a1,color:#fff,stroke:#38bdf8
    style SC fill:#0369a1,color:#fff,stroke:#38bdf8
    style PAGES fill:#075985,color:#bae6fd,stroke:#0284c7
    style COMPS fill:#075985,color:#bae6fd,stroke:#0284c7
    style HOOKS fill:#075985,color:#bae6fd,stroke:#0284c7
    style LIB fill:#075985,color:#bae6fd,stroke:#0284c7
    style CONSTS fill:#075985,color:#bae6fd,stroke:#0284c7
    style CONFIG fill:#075985,color:#bae6fd,stroke:#0284c7
    style CONTRACTS fill:#075985,color:#bae6fd,stroke:#0284c7
    style IGNITION fill:#075985,color:#bae6fd,stroke:#0284c7
    style TESTS fill:#075985,color:#bae6fd,stroke:#0284c7
    style SCRIPTS fill:#075985,color:#bae6fd,stroke:#0284c7
    style V fill:#082f49,color:#7dd3fc,stroke:#0ea5e9
    style IR fill:#082f49,color:#7dd3fc,stroke:#0ea5e9
    style RR fill:#082f49,color:#7dd3fc,stroke:#0ea5e9
    style VR fill:#082f49,color:#7dd3fc,stroke:#0ea5e9
    style USDC fill:#082f49,color:#7dd3fc,stroke:#0ea5e9
```

---

## Smart Contract Architecture

### Deployed Contracts

| Contract | Network | Address |
|---|---|---|
| `MockUSDC` | Sepolia | `0x17cCeBc2960F50042Fb8f64c18478f083FF0ACDc` |
| `TRECIdentityRegistry` | Sepolia | `0x5e8c8f67f9Ee0115F7Dc32deA8c7258b4690b55A` |
| `TRECReputationRegistry` | Sepolia | `0xfB81bCA7966A12F9dD367EE1DBd32d1a50047DD3` |
| `TRECValidationRegistry` | Sepolia | `0x9F7e8DFEC3d9871F6ff896E7c429E7968E1Ba347` |
| `TRECVault` | Base Sepolia | `0x0c04318CFb1b3A725f7643f107B102E3c0dc719c` |

### Contract Interaction Map

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#059669', 'primaryTextColor': '#fff', 'primaryBorderColor': '#047857', 'lineColor': '#34d399', 'secondaryColor': '#064e3b', 'tertiaryColor': '#022c22'}}}%%
classDiagram
    class TRECVault {
        +depositLiquidity(amount)
        +stakeBond() payable
        +issueLoan(operator, agentWallet, amount) onlyOwner
        +repayLoan(agentId, amount)
        +slashAndRecover(operator, shortfall) onlyOwner
        -totalPoolLiquidity uint256
        -lenderDeposits mapping
        -operatorBonds mapping
    }

    class TRECIdentityRegistry {
        +registerAgent(ensName, metadataURI)
        +getAgentId(operator) uint256
        -ERC721 Soulbound NFT
        -_update() override no-transfer
    }

    class TRECReputationRegistry {
        +recordBorrow(agentId, amount) onlyVault
        +recordRepayment(agentId, amount) onlyVault
        +recordLiquidation(agentId) onlyVault
        +getCreditScore(agentId) uint256
        -creditScore +1 on repay
        -creditScore -50 on liquidation
    }

    class TRECValidationRegistry {
        +submitValidationSignature(sig, data)
        +isAgentVerified(tokenId) bool
        -EIP712 typed signing
        -Backend signer validates KYC
    }

    class MockUSDC {
        +mint(to, amount)
        +transfer() approve()
        -6 decimals ERC20
    }

    TRECVault --> TRECIdentityRegistry : reads agentId
    TRECVault --> TRECReputationRegistry : records activity
    TRECVault --> TRECValidationRegistry : checks KYC
    TRECVault --> MockUSDC : transfers liquidity
```

### Credit Score System

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#d97706', 'primaryTextColor': '#fff', 'primaryBorderColor': '#b45309', 'lineColor': '#fbbf24', 'secondaryColor': '#451a03'}}}%%
stateDiagram-v2
    [*] --> Registered : registerAgent()
    Registered --> Borrowing : issueLoan() ✅
    Borrowing --> Repaid : repayLoan() → Score +1
    Repaid --> Borrowing : Next loan cycle
    Borrowing --> Liquidated : slashAndRecover() → Score -50
    Liquidated --> Registered : Can re-register
    Repaid --> [*] : Agent retires
```

---

## Multi-Chain Setup

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#7c3aed', 'primaryTextColor': '#fff', 'primaryBorderColor': '#6d28d9', 'lineColor': '#c4b5fd'}}}%%
graph LR
    subgraph Sepolia["🔵 Ethereum Sepolia (Chain ID: 11155111)"]
        ID["TRECIdentityRegistry\nSoulbound NFTs"]
        REP["TRECReputationRegistry\nCredit Scores"]
        VAL["TRECValidationRegistry\nEIP-712 KYC"]
        ENS["ENS NameWrapper\ntrecc.eth subnames"]
        USDC_S["MockUSDC"]
    end

    subgraph BaseSepolia["🔷 Base Sepolia (Chain ID: 84532)"]
        VAULT["TRECVault\nLending Pool"]
    end

    subgraph Frontend["🖥️ TRECC_APP"]
        WAGMI["Wagmi + Reown\nMulti-wallet"]
    end

    Frontend --> Sepolia
    Frontend --> BaseSepolia

    style Sepolia fill:#1e1b4b,color:#c7d2fe,stroke:#6366f1
    style BaseSepolia fill:#0c4a6e,color:#bae6fd,stroke:#0284c7
    style Frontend fill:#064e3b,color:#a7f3d0,stroke:#059669
```

---

## Tech Stack

### Frontend
| Layer | Technology |
|---|---|
| Framework | Next.js 16.1.6 (App Router) |
| UI | React 19.2.3 + Tailwind CSS 4 |
| Blockchain | Wagmi 2.19.5 + Viem 2.47.4 |
| Wallet Modal | Reown AppKit 1.8.19 |
| Data Fetching | TanStack React Query 5 |
| Charts | Liveline |
| Icons | Lucide React |
| Agent Vault | Coinbase (CDP) |
| ENS | Viem ENS utilities + ethers.js 6 |

### Smart Contracts
| Layer | Technology |
|---|---|
| Language | Solidity 0.8.24 (EVM: Cancun) |
| Framework | Hardhat 2.28.6 + Ignition |
| Standards | OpenZeppelin Contracts 5.6.1 |
| Typed Bindings | TypeChain |
| Signing | EIP-712 structured data |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A wallet (MetaMask, Coinbase Wallet, etc.)
- Sepolia ETH (for gas + 0.01 ETH collateral)
- Sepolia USDC (for lending)

### Setup

**1. Clone the repo**
```bash
git clone <repo-url>
cd Trecc-synthesis
```

**2. Start the frontend**
```bash
cd TRECC_APP
npm install
cp .env.eg .env.local
# Fill in your env vars (see below)
npm run dev
```

**3. (Optional) Deploy contracts**
```bash
cd TRECC_SMART_CONTRACTS
npm install
npx hardhat ignition deploy ./ignition/modules/Deploy.ts --network sepolia
```

### Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_PROJECT_ID` | Reown / WalletConnect project ID |
| `TRECC_ENS_OWNER_PRIVATE_KEY` | Private key of `trecc.eth` owner (for subname registration) |
| `SEPOLIA_RPC_URL` | Sepolia RPC endpoint |
| `COINBASE_API_SECRET` | *(Optional)* Coinbase integration |
| `COINBASE_BIN_API_KEY` | *(Optional)* Coinbase API key |

---

## Protocol Flow

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#db2777', 'primaryTextColor': '#fff', 'primaryBorderColor': '#be185d', 'lineColor': '#f472b6'}}}%%
sequenceDiagram
    actor Lender
    actor Operator
    participant App as TRECC App
    participant ENS as ENS NameWrapper
    participant ID as TRECIdentityRegistry
    participant KYC as TRECValidationRegistry
    participant Vault as TRECVault
    participant Agent as AI Agent (MPC)

    Lender->>App: Connect wallet
    Lender->>Vault: depositLiquidity(USDC)
    Vault-->>Lender: ✅ Deposit recorded, earns APY

    Operator->>App: Connect wallet
    Operator->>ENS: Register subname (e.g. alice.trecc.eth)
    Operator->>App: Submit KYC form
    Operator->>Vault: stakeBond() [0.01 ETH]
    Operator->>ID: registerAgent(ensName, metadataURI)
    ID-->>Operator: 🪙 Soulbound NFT minted (tokenId)
    Operator->>KYC: submitValidationSignature(EIP-712 sig)
    KYC-->>Operator: ✅ KYC verified

    Operator->>App: Chat with Elsa AI
    App->>Vault: issueLoan(operator, agentWallet, amount)
    Vault-->>Agent: 💸 USDC transferred to Coinbase Vault

    Agent->>Vault: repayLoan(agentId, amount)
    Vault-->>Agent: ✅ Loan repaid, credit score +1
```

---

## Key Protocol Properties

- **Soulbound Identity** — ERC-721 NFTs that cannot be transferred (ERC-8004)
- **On-chain Credit Scores** — +1 per repayment, −50 per liquidation
- **EIP-712 KYC** — Cryptographically signed off-chain verification, verified on-chain
- **ENS Subnames** — Every agent gets a human-readable `<name>.trecc.eth` identity
- **Coinbase Vault** — Coinbase-powered agent execution wallets and vault infrastructure
- **Intent-based UX** — Elsa AI co-pilot translates natural language to contract calls

---

## License

MIT
