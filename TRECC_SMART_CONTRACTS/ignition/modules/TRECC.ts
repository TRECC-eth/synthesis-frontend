import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("TRECCProtocol", (m) => {
  const deployer = m.getAccount(0);

  const mockUSDC = m.contract("MockUSDC");
  const identityRegistry = m.contract("TRECIdentityRegistry");
  const reputationRegistry = m.contract("TRECReputationRegistry");

  // We pass the identity registry and the authorized backend signer (deployer)
  const validationRegistry = m.contract("TRECValidationRegistry", [
    identityRegistry, 
    deployer 
  ]);

  const vault = m.contract("TRECVault", [
    mockUSDC,
    identityRegistry,
    reputationRegistry
  ]);

  // Crucial: This allows the Vault to update credit scores when loans are repaid
  m.call(reputationRegistry, "setVaultAuthorization", [vault, true]);

  return { 
    mockUSDC, 
    identityRegistry, 
    reputationRegistry, 
    validationRegistry, 
    vault 
  };
});