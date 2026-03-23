import hre from "hardhat";

async function main() {
  const { ethers } = hre as any;
  const [deployer] = await ethers.getSigners();
  
  console.log("🚀 Resuming TRECC Deployment (Phase 3)...");

  // 1. MockUSDC (Already Deployed)
  const mockUSDCAddr = "0x3d2f179c150722Fd93Eb244D3A0960A941a3fe49";
  // 2. Identity (Already Deployed)
  const identityAddr = "0xc2c6f9c0668Eb1C22E6EE8666e47633945b33329";
  // 3. Reputation (Already Deployed)
  const reputationAddr = "0xBBA22199282BE09F4ce72Cbc9cCAe2ff0269cDAd";

  console.log("✅ Using existing MockUSDC:", mockUSDCAddr);
  console.log("✅ Using existing IdentityRegistry:", identityAddr);
  console.log("✅ Using existing ReputationRegistry:", reputationAddr);

  // 4. Validation
  console.log("⏳ Deploying ValidationRegistry...");
  const Validation = await ethers.getContractFactory("TRECValidationRegistry");
  const validation = await Validation.deploy(identityAddr, deployer.address);
  await validation.waitForDeployment();
  const validationAddr = await validation.getAddress();
  console.log("✅ ValidationRegistry:", validationAddr);

  // 5. Vault
  console.log("⏳ Deploying Vault...");
  const Vault = await ethers.getContractFactory("TRECVault");
  const vault = await Vault.deploy(
    mockUSDCAddr, 
    identityAddr, 
    reputationAddr
  );
  await vault.waitForDeployment();
  const vaultAddr = await vault.getAddress();
  console.log("✅ Vault:", vaultAddr);

  // 6. Auth
  console.log("⚙️  Authorizing Vault...");
  const reputationContract = await ethers.getContractAt("TRECReputationRegistry", reputationAddr);
  const tx = await reputationContract.setVaultAuthorization(vaultAddr, true);
  await tx.wait();
  
  console.log("\n🎉 ALL CONTRACTS DEPLOYED ON BASE SEPOLIA!");
  console.log("------------------------------------------");
  console.log("MockUSDC:", mockUSDCAddr);
  console.log("IdentityRegistry:", identityAddr);
  console.log("ReputationRegistry:", reputationAddr);
  console.log("ValidationRegistry:", validationAddr);
  console.log("Vault:", vaultAddr);
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});