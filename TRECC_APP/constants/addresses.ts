// Your live Base Sepolia Contract Addresses!
export const MOCK_USDC_ADDRESS = "0x3d2f179c150722Fd93Eb244D3A0960A941a3fe49";

// Core Registries
export const TREC_IDENTITY_REGISTRY_ADDRESS = "0xc2c6f9c0668Eb1C22E6EE8666e47633945b33329";
export const TREC_REPUTATION_REGISTRY_ADDRESS = "0xBBA22199282BE09F4ce72Cbc9cCAe2ff0269cDAd";
export const TREC_VALIDATION_REGISTRY_ADDRESS = "0x11B113A558937C9bEF792276d75Ce6d5f970D99f";

// Main Vault
export const TREC_VAULT_ADDRESS = "0x0c04318CFb1b3A725f7643f107B102E3c0dc719c";

// Keeping this for backward compatibility if your frontend uses the general "REGISTRY" name
export const TREC_REGISTRY_ADDRESS = "0xc2c6f9c0668Eb1C22E6EE8666e47633945b33329";

/** KYC collateral is sent to this address on Base Sepolia (Now pointing to the new Vault) */
export const KYC_COLLATERAL_RECEIVER = "0x0c04318CFb1b3A725f7643f107B102E3c0dc719c" as const;