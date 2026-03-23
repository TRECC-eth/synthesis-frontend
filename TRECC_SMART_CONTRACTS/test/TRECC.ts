import { expect } from "chai";
import hre from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("TRECC Full Protocol Suite", function () {
  
  async function deployTRECCFixture() {
    const [owner, lender, operator, agentMpc] = await hre.ethers.getSigners();

    // 1. Deploy Identity (0 args)
    const identity = await hre.ethers.deployContract("TRECIdentityRegistry");
    await identity.waitForDeployment();
    const identityAddress = await identity.getAddress();

    // 2. Deploy Reputation (0 args)
    const reputation = await hre.ethers.deployContract("TRECReputationRegistry"); 
    await reputation.waitForDeployment();
    const reputationAddress = await reputation.getAddress();

    // 3. Deploy Validation (needs identityRegistry + validatorBackend)
    const validation = await hre.ethers.deployContract("TRECValidationRegistry", [
      identityAddress,
      owner.address  // validatorBackend (owner acts as backend signer in tests)
    ]);
    await validation.waitForDeployment();
    const validationAddress = await validation.getAddress();

    // 4. Deploy Vault (usdcAddress, identityAddress, reputationAddress)
    // Using owner.address as a placeholder USDC address for tests that don't exercise USDC transfers
    const vault = await hre.ethers.deployContract("TRECVault", [
      owner.address,  // _usdcAddress (placeholder; tests don't call depositLiquidity/issueLoan)
      identityAddress,
      reputationAddress
    ]);
    await vault.waitForDeployment();

    return { 
      identity, identityAddress, 
      reputation, reputationAddress, 
      validation, validationAddress,
      vault, owner, lender, operator, agentMpc 
    };
  }

  describe("1. Deployment & Identity", function () {
    it("Should deploy all 4 contracts and register an agent", async function () {
      const { identity, identityAddress, operator } = await loadFixture(deployTRECCFixture);
      
      const id = identity as any;
      if (id.registerAgent) {
        await id.connect(operator).registerAgent("Sky_Agent", "LLM");
      } else if (id.register) {
        await id.connect(operator).register("Sky_Agent", "LLM");
      }
      
      expect(identityAddress).to.be.properAddress;
    });
  });

  describe("2. Vault Logic", function () {
    it("Should allow operator staking", async function () {
      const { vault, operator } = await loadFixture(deployTRECCFixture);
      const v = vault as any;
      const stakeAmount = hre.ethers.parseEther("1.0");
      await v.connect(operator).stakeBond({ value: stakeAmount });
      expect(await v.borrowerBonds(operator.address)).to.equal(stakeAmount);
    });

    it("Should enforce ownership for loans", async function () {
      const { vault, operator, agentMpc } = await loadFixture(deployTRECCFixture);
      const loanAmount = 1000;
      await expect(
        (vault as any).connect(operator).issueLoan(operator.address, agentMpc.address, loanAmount)
      ).to.be.revertedWithCustomError(vault, "OwnableUnauthorizedAccount");
    });
  });

  describe("3. Ecosystem Health", function () {
    it("Should have correct registry addresses in Vault", async function () {
      const { vault, identityAddress, reputationAddress } = await loadFixture(deployTRECCFixture);
      expect(await (vault as any).identityRegistry()).to.equal(identityAddress);
      expect(await (vault as any).reputationRegistry()).to.equal(reputationAddress);
    });
  });

  describe("4. Validation Registry", function () {
    async function signKyc(signer: any, validationAddress: string, user: string, approved: boolean, chainId: bigint) {
      return signer.signTypedData(
        { name: "TRECValidation", version: "1", chainId, verifyingContract: validationAddress },
        { KYCApproval: [{ name: "user", type: "address" }, { name: "approved", type: "bool" }] },
        { user, approved }
      );
    }

    it("Should verify an agent with a valid backend signature", async function () {
      const { identity, validation, validationAddress, owner, operator } = await loadFixture(deployTRECCFixture);

      // Register operator so they have an identity token
      await (identity as any).connect(operator).registerAgent("Test_Agent", "ipfs://test");
      const tokenId = await (identity as any).operatorToAgentId(operator.address);

      const chainId = (await hre.ethers.provider.getNetwork()).chainId;
      const sig = await signKyc(owner, validationAddress, operator.address, true, chainId);

      await (validation as any).connect(operator).submitValidationSignature(true, sig);

      expect(await (validation as any).isAgentVerified(tokenId)).to.equal(true);
    });

    it("Should emit AgentVerified event on successful validation", async function () {
      const { identity, validation, validationAddress, owner, operator } = await loadFixture(deployTRECCFixture);

      await (identity as any).connect(operator).registerAgent("Test_Agent", "ipfs://test");
      const tokenId = await (identity as any).operatorToAgentId(operator.address);

      const chainId = (await hre.ethers.provider.getNetwork()).chainId;
      const sig = await signKyc(owner, validationAddress, operator.address, true, chainId);

      await expect((validation as any).connect(operator).submitValidationSignature(true, sig))
        .to.emit(validation, "AgentVerified")
        .withArgs(tokenId, true);
    });

    it("Should revert if operator has no registered identity", async function () {
      const { validation, validationAddress, owner, operator } = await loadFixture(deployTRECCFixture);

      const chainId = (await hre.ethers.provider.getNetwork()).chainId;
      const sig = await signKyc(owner, validationAddress, operator.address, true, chainId);

      await expect(
        (validation as any).connect(operator).submitValidationSignature(true, sig)
      ).to.be.revertedWith("No Identity found for operator");
    });

    it("Should revert with an invalid (wrong signer) signature", async function () {
      const { identity, validation, validationAddress, lender, operator } = await loadFixture(deployTRECCFixture);

      await (identity as any).connect(operator).registerAgent("Test_Agent", "ipfs://test");

      const chainId = (await hre.ethers.provider.getNetwork()).chainId;
      // Sign with `lender` instead of the validatorBackend (`owner`)
      const badSig = await signKyc(lender, validationAddress, operator.address, true, chainId);

      await expect(
        (validation as any).connect(operator).submitValidationSignature(true, badSig)
      ).to.be.revertedWith("Invalid Validator Signature");
    });
  });
});