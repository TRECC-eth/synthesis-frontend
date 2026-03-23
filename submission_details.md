# TRECC Protocol — Hackathon Submission Details

## Authentication

- **API Key**: _(paste your `sk-synth-...` key here)_
- **Credentials file path**: _(update if stored elsewhere)_

---

## Project Info

### `name`

TRECC Protocol — Trustless Reputation & Evaluation Credit (ERC-8004 AI Agent Lending)

### `description`

TRECC is a decentralized lending infrastructure built for the agentic economy. It bridges capital providers (lenders) with autonomous AI agents (borrowers) using on-chain identity, reputation scoring, and cryptographic KYC verification. The protocol enables mathematically-verified autonomous AI agents to borrow USDC while human operators post ETH collateral bonds — replacing traditional credit checks with verifiable on-chain behavior.

### `problemStatement`

AI agents have no credit history or legal identity in traditional finance systems, making it impossible for them to access capital without centralized intermediaries. There is no trustless, standardized way to verify autonomous agent identity, score their on-chain reputation, or manage lending risk across human operators and their agents. TRECC solves this by providing soulbound NFT identity (ERC-8004), on-chain credit scoring, EIP-712 KYC verification, and a multi-chain lending vault — giving autonomous AI agents a credible financial identity and access to USDC liquidity.

### `repoURL`

https://github.com/TRECC-eth/Trecc-synthesis

### `deployedURL`

https://trecc.vercel.app/

### `videoURL`

_(leave empty — video still being created)_

### `coverImageURL`

https://drive.google.com/uc?export=view&id=1pJL8xPbXhhRd5zcctFlQQl5kIarSj_SA

### `pictures`

- https://drive.google.com/uc?export=view&id=1qeTXyVLTzKBar5Qm-0sL-4GXwPzWMt0m
- https://drive.google.com/uc?export=view&id=1PUVncem3bk8FTH3lxAI5ChT84uNZGdFR
- https://drive.google.com/uc?export=view&id=1SGI9eQlw16flifzYas5CdUeQdC5Rk0Lb
- https://drive.google.com/uc?export=view&id=11uTSG5wsjw1xC3KyNXX1PLAdWJ46wbzT

---

## Tracks

### Base
- **Autonomous Trading Agent** — `bf374c2134344629aaadb5d6e639e840`
- **Agent Services on Base** — `6f0e3d7dcadf4ef080d3f424963caff5`

### Protocol Labs
- **🤖 Let the Agent Cook — No Humans Required** — `10bd47fac07e4f85bda33ba482695b24`
- **Agents With Receipts — ERC-8004** — `3bf41be958da497bbb69f1a150c76af9`

### ENS
- **ENS Identity** — `627a3f5a288344489fe777212b03f953`
- **ENS Open Integration** — `8840da28fb3b46bcb08465e1d0e8756d`
- **ENS Communication** — `9c4599cf9d0f4002b861ff1a4b27f10a`

### Venice
- **Private Agents, Trusted Actions** — `ea3b366947c54689bd82ae80bf9f3310`

### College.xyz
- **Student Founder's Bet** — `f467eea3352b4a289814a522377fcef6`

---

## Submission Metadata

### `agentFramework`

`other`

### `agentFrameworkOther`

Custom intent-based engine (Elsa AI Co-Pilot) — keyword parser that translates natural language to on-chain Viem/Wagmi contract calls; no external LLM or agent framework used

### `agentHarness`

`claude-code`

### `model`

`claude-sonnet-4-6`

### `skills`

_(List only skills actually loaded — update before submitting)_

- _(e.g., web-search, frontend-design, etc.)_

### `tools`

- Next.js
- React
- Tailwind CSS
- TypeScript
- Hardhat
- Hardhat Ignition
- Solidity
- OpenZeppelin Contracts
- Viem
- Wagmi
- Ethers.js
- Reown AppKit
- WalletConnect
- Coinbase CDP (MPC wallet)
- TanStack React Query
- TypeChain
- Mocha + Chai
- ENS NameWrapper
- Blockscout API
- 1inch Router
- dotenv

### `helpfulResources`

_(List specific doc URLs you actually opened — leave empty if unsure)_

### `helpfulSkills`

_(List skills that were especially impactful with a reason — leave empty if none)_

### `intention`

`continuing`

### `intentionNotes`

_(Optional: roadmap highlights, fundraising interest, etc.)_

### `moltbookPostURL`

_(Post on Moltbook first, then paste URL here)_

---

## Conversation Log

_(Paste or summarize your full human-agent collaboration log here — brainstorms, pivots, breakthroughs. This is judged.)_

---

## Smart Contract Addresses (for reference)

| Contract               | Network      | Address                                      |
| ---------------------- | ------------ | -------------------------------------------- |
| MockUSDC               | Sepolia      | `0x17cCeBc2960F50042Fb8f64c18478f083FF0ACDc` |
| TRECIdentityRegistry   | Base Sepolia | `0x5e8c8f67f9Ee0115F7Dc32deA8c7258b4690b55A` |
| TRECReputationRegistry | Base Sepolia | `0xfB81bCA7966A12F9dD367EE1DBd32d1a50047DD3` |
| TRECValidationRegistry | Base Sepolia | `0x9F7e8DFEC3d9871F6ff896E7c429E7968E1Ba347` |
| TRECVault              | Base Sepolia | `0x0c04318CFb1b3A725f7643f107B102E3c0dc719c` |

---

## Pre-Publish Checklist

- [ ] API key added above
- [ ] `trackUUIDs` selected and added
- [ ] `videoURL` added (once video is done)
- [ ] `moltbookPostURL` added (after posting on Moltbook)
- [ ] `conversationLog` filled in
- [ ] `skills` list updated with actually-used skills
- [ ] `intention` set
- [ ] Self-custody transfer completed (`POST /participants/me/transfer/init` → confirm)
- [ ] Project published by team admin
- [ ] Tweeted about project tagging @synthesis_md
