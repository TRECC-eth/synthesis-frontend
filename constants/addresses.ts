// Your live Sepolia Contract Addresses!
export const MOCK_USDC_ADDRESS = "0x17cCeBc2960F50042Fb8f64c18478f083FF0ACDc";

// Core Registries
export const TREC_IDENTITY_REGISTRY_ADDRESS = "0x5e8c8f67f9Ee0115F7Dc32deA8c7258b4690b55A";
export const TREC_REPUTATION_REGISTRY_ADDRESS = "0xfB81bCA7966A12F9dD367EE1DBd32d1a50047DD3";
export const TREC_VALIDATION_REGISTRY_ADDRESS = "0x9F7e8DFEC3d9871F6ff896E7c429E7968E1Ba347";

// Main Vault
export const TREC_VAULT_ADDRESS = "0xD198499F21BAab91FEe2C02D024Edede66D9334a";

// Keeping this for backward compatibility if your frontend uses the general "REGISTRY" name
export const TREC_REGISTRY_ADDRESS = "0x5e8c8f67f9Ee0115F7Dc32deA8c7258b4690b55A";

/** KYC collateral is sent to this address on Sepolia (Now pointing to the new Vault) */
export const KYC_COLLATERAL_RECEIVER = "0xD198499F21BAab91FEe2C02D024Edede66D9334a" as const;