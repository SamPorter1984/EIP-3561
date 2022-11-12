const {time,loadFixture} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const EERC20ABI = require("../artifacts/contracts/EERC20.sol/EERC20.json");

describe("TrustMinimizedProxy",()=>{
  const ADMIN_SLOT = "0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103";
  const LOGIC_SLOT = "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc";
  const NEXT_LOGIC_SLOT = "0x19e3fabe07b65998b604369d85524946766191ac9434b39e27c424c976493685";
  const NEXT_LOGIC_BLOCK_SLOT = "0xe3228ec3416340815a9ca41bfee1103c47feb764b4f0f4412f5d92df539fe0ee";
  const PROPOSE_BLOCK_SLOT = "0x4b50776e56454fad8a52805daac1d9fd77ef59e4f1a053c342aaae5568af1388";
  const ZERO_TRUST_PERIOD_SLOT = "0x7913203adedf5aca5386654362047f05edbd30729ae4b0351441c46289146720";

  async function deployTrustMinimizedProxyFixture() {
    const [owner, otherAccount] = await ethers.getSigners();
    const TrustMinimizedProxy = await ethers.getContractFactory("TrustMinimizedProxy");
    const trustMinimizedProxy = await TrustMinimizedProxy.deploy();
    return { trustMinimizedProxy, owner, otherAccount };
  }

  async function trustMinimizedProxyFirstLogicSetFixture() {
    const [owner, otherAccount, acc2, acc3, acc4, acc5] = await ethers.getSigners();
    const MockLogic = await ethers.getContractFactory("EERC20");
    const mockLogic = await MockLogic.deploy();
    const TrustMinimizedProxy = await ethers.getContractFactory("TrustMinimizedProxy");
    const trustMinimizedProxy = await TrustMinimizedProxy.deploy();
    const iEERC20 = new ethers.utils.Interface(EERC20ABI.abi);
    const init = iEERC20.encodeFunctionData("init",[acc2.address, acc3.address, acc4.address, acc5.address]);
    await trustMinimizedProxy.proposeTo(mockLogic.address,init);
    return { trustMinimizedProxy, owner, otherAccount, mockLogic };
  }

  async function trustMinimizedProxyZeroTrustPeriodSetFixture() {
    const [owner, otherAccount] = await ethers.getSigners();
    const TrustMinimizedProxy = await ethers.getContractFactory("TrustMinimizedProxy");
    const trustMinimizedProxy = await TrustMinimizedProxy.deploy();
    await trustMinimizedProxy.setZeroTrustPeriod(2);
    return { trustMinimizedProxy, owner, otherAccount };
  }

  async function trustMinimizedProxyZeroTrustPeriodSetNextLogicBlockPassedFixture() {
    const [owner, otherAccount] = await ethers.getSigners();
    const TrustMinimizedProxy = await ethers.getContractFactory("TrustMinimizedProxy");
    const trustMinimizedProxy = await TrustMinimizedProxy.deploy();
    await trustMinimizedProxy.setZeroTrustPeriod(1);
    const ONE_DAY = 60 * 60 * 24;
    const passedTime = (await time.latest()) + ONE_DAY;
    await time.increaseTo(passedTime);
    return { trustMinimizedProxy, owner, otherAccount, passedTime };
  }

  async function zeroTrustPeriodSetFirstLogicSetFixture() {
    const [owner, otherAccount, acc2, acc3, acc4, acc5] = await ethers.getSigners();
    const MockLogic = await ethers.getContractFactory("EERC20");
    const mockLogic = await MockLogic.deploy();
    const TrustMinimizedProxy = await ethers.getContractFactory("TrustMinimizedProxy");
    const trustMinimizedProxy = await TrustMinimizedProxy.deploy();
    const iEERC20 = new ethers.utils.Interface(EERC20ABI.abi);
    const init = iEERC20.encodeFunctionData("init",[acc2.address, acc3.address, acc4.address, acc5.address]);
    await trustMinimizedProxy.proposeTo(mockLogic.address,init);
    await trustMinimizedProxy.setZeroTrustPeriod(2);
    return { trustMinimizedProxy, owner, otherAccount, mockLogic };
  }

  async function zeroTrustPeriodSetFirstLogicSetNextLogicBlockPassedFixture() {
    const [owner, otherAccount, acc2, acc3, acc4, acc5] = await ethers.getSigners();
    const MockLogic = await ethers.getContractFactory("EERC20");
    const mockLogic = await MockLogic.deploy();
    const TrustMinimizedProxy = await ethers.getContractFactory("TrustMinimizedProxy");
    const trustMinimizedProxy = await TrustMinimizedProxy.deploy();
    const iEERC20 = new ethers.utils.Interface(EERC20ABI.abi);
    const init = iEERC20.encodeFunctionData("init",[acc2.address, acc3.address, acc4.address, acc5.address]);
    await trustMinimizedProxy.proposeTo(mockLogic.address,init);
    await trustMinimizedProxy.setZeroTrustPeriod(2);
    const ONE_DAY = 60 * 60 * 24;
    const passedTime = (await time.latest()) + ONE_DAY;
    await time.increaseTo(passedTime);
    return { trustMinimizedProxy, owner, otherAccount, mockLogic, passedTime };
  }

  describe("AFTER DEPLOYMENT",()=>{
    it("Should confirm ADMIN_SLOT is valid", async()=>{
      const { trustMinimizedProxy } = await loadFixture(deployTrustMinimizedProxyFixture);
      const adminSlot = (ethers.BigNumber.from(ethers.utils.keccak256(ethers.utils.toUtf8Bytes('eip1967.proxy.admin'))).sub(ethers.BigNumber.from(1))).toHexString();
      expect(adminSlot).to.equal(ADMIN_SLOT);
    });
    it("Should confirm LOGIC_SLOT is valid", async()=>{
      const { trustMinimizedProxy } = await loadFixture(deployTrustMinimizedProxyFixture);
      const logicSlot = (ethers.BigNumber.from(ethers.utils.keccak256(ethers.utils.toUtf8Bytes('eip1967.proxy.implementation'))).sub(ethers.BigNumber.from(1))).toHexString();
      expect(logicSlot).to.equal(LOGIC_SLOT);
    });
    it("Should confirm NEXT_LOGIC_SLOT is valid", async()=>{
      const { trustMinimizedProxy } = await loadFixture(deployTrustMinimizedProxyFixture);
      const nextLogicSlot = (ethers.BigNumber.from(ethers.utils.keccak256(ethers.utils.toUtf8Bytes('eip3561.proxy.next.logic'))).sub(ethers.BigNumber.from(1))).toHexString();
      expect(nextLogicSlot).to.equal(NEXT_LOGIC_SLOT);
    });
    it("Should confirm NEXT_LOGIC_BLOCK_SLOT is valid", async()=>{
      const { trustMinimizedProxy } = await loadFixture(deployTrustMinimizedProxyFixture);
      const nextLogicBlockSlot = (ethers.BigNumber.from(ethers.utils.keccak256(ethers.utils.toUtf8Bytes('eip3561.proxy.next.logic.block'))).sub(ethers.BigNumber.from(1))).toHexString();
      expect(nextLogicBlockSlot).to.equal(NEXT_LOGIC_BLOCK_SLOT);
    });
    it("Should confirm PROPOSE_BLOCK_SLOT is valid", async()=>{
      const { trustMinimizedProxy} = await loadFixture(deployTrustMinimizedProxyFixture);
      const proposeBlockSlot = (ethers.BigNumber.from(ethers.utils.keccak256(ethers.utils.toUtf8Bytes('eip3561.proxy.propose.block'))).sub(ethers.BigNumber.from(1))).toHexString();
      expect(proposeBlockSlot).to.equal(PROPOSE_BLOCK_SLOT);
    });
    it("Should confirm ZERO_TRUST_PERIOD_SLOT is valid", async()=>{
      const { trustMinimizedProxy } = await loadFixture(deployTrustMinimizedProxyFixture);
      const zeroTrustPeriodSlot = (ethers.BigNumber.from(ethers.utils.keccak256(ethers.utils.toUtf8Bytes('eip3561.proxy.zero.trust.period'))).sub(ethers.BigNumber.from(1))).toHexString();
      expect(zeroTrustPeriodSlot).to.equal(ZERO_TRUST_PERIOD_SLOT);
    });
    it("Should set the right owner(msg.sender)", async()=>{
      const { trustMinimizedProxy, owner } = await loadFixture(deployTrustMinimizedProxyFixture);
      const adminAddress = ethers.utils.getAddress(ethers.utils.hexStripZeros(await ethers.provider.getStorageAt(trustMinimizedProxy.address, ADMIN_SLOT)));
      expect(adminAddress).to.equal(owner.address);
    });
    it("Should have LOGIC_SLOT empty", async()=>{
      const { trustMinimizedProxy } = await loadFixture(deployTrustMinimizedProxyFixture);
      const slotVal = await ethers.provider.getStorageAt(trustMinimizedProxy.address, LOGIC_SLOT);
      expect(slotVal).to.equal(ethers.constants.HashZero);
    });
    it("Should have NEXT_LOGIC_SLOT empty", async()=>{
      const { trustMinimizedProxy } = await loadFixture(deployTrustMinimizedProxyFixture);
      const slotVal = await ethers.provider.getStorageAt(trustMinimizedProxy.address, NEXT_LOGIC_SLOT);
      expect(slotVal).to.equal(ethers.constants.HashZero);
    });
    it("Should have NEXT_LOGIC_BLOCK_SLOT empty", async()=>{
      const { trustMinimizedProxy } = await loadFixture(deployTrustMinimizedProxyFixture);
      const slotVal = await ethers.provider.getStorageAt(trustMinimizedProxy.address, NEXT_LOGIC_BLOCK_SLOT);
      expect(slotVal).to.equal(ethers.constants.HashZero);
    });
    it("Should have PROPOSE_BLOCK_SLOT empty", async()=>{
      const { trustMinimizedProxy } = await loadFixture(deployTrustMinimizedProxyFixture);
      const slotVal = await ethers.provider.getStorageAt(trustMinimizedProxy.address, PROPOSE_BLOCK_SLOT);
      expect(slotVal).to.equal(ethers.constants.HashZero);
    });
    it("Should have PROPOSE_BLOCK_SLOT empty", async()=>{
      const { trustMinimizedProxy } = await loadFixture(deployTrustMinimizedProxyFixture);
      const slotVal = await ethers.provider.getStorageAt(trustMinimizedProxy.address, PROPOSE_BLOCK_SLOT);
      expect(slotVal).to.equal(ethers.constants.HashZero);
    });
    it("Should have ZERO_TRUST_PERIOD_SLOT empty", async()=>{
      const { trustMinimizedProxy } = await loadFixture(deployTrustMinimizedProxyFixture);
      const slotVal = await ethers.provider.getStorageAt(trustMinimizedProxy.address, ZERO_TRUST_PERIOD_SLOT);
      expect(slotVal).to.equal(ethers.constants.HashZero);
    });
    describe("IfAdmin Interactions",()=>{
      it("changeAdmin(address newAdm): should change admin if called by admin", async()=>{
        const { owner, otherAccount, trustMinimizedProxy } = await loadFixture(deployTrustMinimizedProxyFixture);
        await expect(trustMinimizedProxy.changeAdmin(otherAccount.address)).to.emit(trustMinimizedProxy, "AdminChanged").withArgs(owner.address,otherAccount.address);
        const adminAddress = ethers.utils.getAddress(ethers.utils.hexStripZeros(await ethers.provider.getStorageAt(trustMinimizedProxy.address, ADMIN_SLOT)));
         expect(adminAddress).to.equal(otherAccount.address);
      });
      it("changeAdmin(address newAdm): should fallback to proxy logic execution if called by not an admin", async()=>{
        const { owner, otherAccount, trustMinimizedProxy } = await loadFixture(deployTrustMinimizedProxyFixture);
        const tx = await trustMinimizedProxy.connect(otherAccount).changeAdmin(otherAccount.address);
        await expect(tx).not.to.be.reverted.to.not.emit(trustMinimizedProxy, "AdminChanged");
        const adminAddress = ethers.utils.getAddress(ethers.utils.hexStripZeros(await ethers.provider.getStorageAt(trustMinimizedProxy.address, ADMIN_SLOT)));
      expect(adminAddress).not.to.equal(otherAccount.address);
      });
      it("upgrade(bytes calldata data): should upgrade logic slot to next logic slot if called by admin", async()=>{
        const { trustMinimizedProxy} = await loadFixture(deployTrustMinimizedProxyFixture);
        await expect(trustMinimizedProxy.upgrade("0x")).to.emit(trustMinimizedProxy, "Upgraded");
        const logic = await ethers.provider.getStorageAt(trustMinimizedProxy.address, LOGIC_SLOT);
        const nextLogic = await ethers.provider.getStorageAt(trustMinimizedProxy.address, NEXT_LOGIC_SLOT);
        expect(logic).to.equal(nextLogic);
      });
      it("upgrade(bytes calldata data): should fallback to proxy logic execution if called by not an admin", async()=>{
        const { otherAccount,trustMinimizedProxy } = await loadFixture(deployTrustMinimizedProxyFixture);
        const tx = await trustMinimizedProxy.connect(otherAccount).upgrade("0x");
        await expect(tx).not.to.be.reverted.to.not.emit(trustMinimizedProxy, "Upgraded");
      });
      it("cancelUpgrade(): should cancel upgrade to next logic slot if called by admin", async()=>{
        const { trustMinimizedProxy } = await loadFixture(deployTrustMinimizedProxyFixture);
        await expect(trustMinimizedProxy.cancelUpgrade()).to.emit(trustMinimizedProxy, "NextLogicCanceled");
        const logic = await ethers.provider.getStorageAt(trustMinimizedProxy.address, LOGIC_SLOT);
        const nextLogic = await ethers.provider.getStorageAt(trustMinimizedProxy.address, NEXT_LOGIC_SLOT);
        expect(logic).to.equal(nextLogic);
      });
      it("cancelUpgrade(): should fallback to proxy logic execution if called by not an admin", async()=>{
        const { otherAccount,trustMinimizedProxy } = await loadFixture(deployTrustMinimizedProxyFixture);
        const tx = await trustMinimizedProxy.connect(otherAccount).cancelUpgrade();
        await expect(tx).not.to.be.reverted.to.not.emit(trustMinimizedProxy, "NextLogicCanceled");
      });
      it("prolongLock(uint b): should increase PROPOSE_BLOCK_SLOT value if called by admin", async()=>{
        const { trustMinimizedProxy } = await loadFixture(deployTrustMinimizedProxyFixture);
        const proposeBlockInitial = await ethers.provider.getStorageAt(trustMinimizedProxy.address, PROPOSE_BLOCK_SLOT);
        const arg = 1;
        await expect(trustMinimizedProxy.prolongLock(arg)).to.emit(trustMinimizedProxy, "ProposingUpgradesRestrictedUntil");
        const proposeBlock= await ethers.provider.getStorageAt(trustMinimizedProxy.address, PROPOSE_BLOCK_SLOT);
        expect(ethers.BigNumber.from(proposeBlockInitial).add(ethers.BigNumber.from(arg))).to.equal(proposeBlock);
      });
      it("prolongLock(uint b): should increase PROPOSE_BLOCK_SLOT value to max uint256 if called by admin", async()=>{
        const { trustMinimizedProxy } = await loadFixture(deployTrustMinimizedProxyFixture);
        const proposeBlockInitial = await ethers.provider.getStorageAt(trustMinimizedProxy.address, PROPOSE_BLOCK_SLOT);
        const arg = ethers.constants.MaxUint256;
        await expect(trustMinimizedProxy.prolongLock(arg)).to.emit(trustMinimizedProxy, "ProposingUpgradesRestrictedUntil");
        const proposeBlock= await ethers.provider.getStorageAt(trustMinimizedProxy.address, PROPOSE_BLOCK_SLOT);
        expect(ethers.BigNumber.from(proposeBlockInitial).add(ethers.BigNumber.from(arg))).to.equal(proposeBlock);
      });
      it("prolongLock(uint b): should fallback to proxy logic execution if called by not an admin", async()=>{
        const { otherAccount,trustMinimizedProxy } = await loadFixture(deployTrustMinimizedProxyFixture);
        const proposeBlockInitial = await ethers.provider.getStorageAt(trustMinimizedProxy.address, PROPOSE_BLOCK_SLOT);
        const arg = 1;
        const tx = await trustMinimizedProxy.connect(otherAccount).prolongLock(arg);
        await expect(tx).not.to.be.reverted.to.not.emit(trustMinimizedProxy, "ProposingUpgradesRestrictedUntil");
        const proposeBlock= await ethers.provider.getStorageAt(trustMinimizedProxy.address, PROPOSE_BLOCK_SLOT);
        expect(proposeBlockInitial).to.equal(proposeBlock);
      });
      it("setZeroTrustPeriod(uint blocks): should change ZERO_TRUST_PERIOD_SLOT value if called by admin",async()=>{
        const { trustMinimizedProxy } = await loadFixture(deployTrustMinimizedProxyFixture);
        const valInitial = await ethers.provider.getStorageAt(trustMinimizedProxy.address, ZERO_TRUST_PERIOD_SLOT);
        const arg = 1;
        await expect(trustMinimizedProxy.setZeroTrustPeriod(arg)).to.emit(trustMinimizedProxy, "ZeroTrustPeriodSet");
        const val= await ethers.provider.getStorageAt(trustMinimizedProxy.address, ZERO_TRUST_PERIOD_SLOT);
        expect(ethers.BigNumber.from(valInitial).add(ethers.BigNumber.from(arg))).to.equal(val);
      });
      it("setZeroTrustPeriod(uint blocks): should fail to change ZERO_TRUST_PERIOD_SLOT value to max uint256 if called by admin",async()=>{
        const { trustMinimizedProxy } = await loadFixture(deployTrustMinimizedProxyFixture);
        const valInitial = await ethers.provider.getStorageAt(trustMinimizedProxy.address, ZERO_TRUST_PERIOD_SLOT);
        const arg = ethers.constants.MaxUint256;
        await expect(trustMinimizedProxy.setZeroTrustPeriod(arg)).to.be.reverted;
        const val= await ethers.provider.getStorageAt(trustMinimizedProxy.address, ZERO_TRUST_PERIOD_SLOT);
        expect(valInitial).to.equal(val);
      });
      it("setZeroTrustPeriod(uint blocks): should fallback to proxy logic execution if called by not an admin", async()=>{
        const { otherAccount,trustMinimizedProxy } = await loadFixture(deployTrustMinimizedProxyFixture);
        const valInitial = await ethers.provider.getStorageAt(trustMinimizedProxy.address, ZERO_TRUST_PERIOD_SLOT);
        const arg = 1;
        const tx = await trustMinimizedProxy.connect(otherAccount).setZeroTrustPeriod(arg);
        await expect(tx).not.to.be.reverted.to.not.emit(trustMinimizedProxy, "ZeroTrustPeriodSet");
        const val= await ethers.provider.getStorageAt(trustMinimizedProxy.address, ZERO_TRUST_PERIOD_SLOT);
        expect(valInitial).to.equal(val);
      });
      it("proposeTo(address newLogic, bytes calldata data): should upgrade if called by admin",async()=>{
        const { otherAccount,trustMinimizedProxy} = await loadFixture(deployTrustMinimizedProxyFixture);
        await expect(trustMinimizedProxy.proposeTo(otherAccount.address,"0x")).to.emit(trustMinimizedProxy, "Upgraded").withArgs(otherAccount.address);
        const logic = ethers.utils.getAddress(ethers.utils.hexStripZeros(await ethers.provider.getStorageAt(trustMinimizedProxy.address, LOGIC_SLOT)));
        expect(logic).to.equal(otherAccount.address);
      });
      it("proposeTo(address newLogic, bytes calldata data): should fallback to proxy logic execution if called by not an admin", async()=>{
        const { owner,otherAccount,trustMinimizedProxy } = await loadFixture(deployTrustMinimizedProxyFixture);
        const logicInit = await ethers.provider.getStorageAt(trustMinimizedProxy.address, LOGIC_SLOT);
        const tx = await trustMinimizedProxy.connect(otherAccount).proposeTo(owner.address,"0x");
        await expect(tx).not.to.be.reverted.to.not.emit(trustMinimizedProxy, "Upgraded");
        const logic = await ethers.provider.getStorageAt(trustMinimizedProxy.address, LOGIC_SLOT);
        expect(logic).to.equal(logicInit);
      });
    });   
  });

  describe("AFTER FIRST LOGIC SET",()=>{
    it("changeAdmin(address newAdm): should change admin if called by admin", async()=>{
      const { owner, otherAccount, trustMinimizedProxy } = await loadFixture(trustMinimizedProxyFirstLogicSetFixture);
      await expect(trustMinimizedProxy.changeAdmin(otherAccount.address)).to.emit(trustMinimizedProxy, "AdminChanged").withArgs(owner.address,otherAccount.address);
      const adminAddress = ethers.utils.getAddress(ethers.utils.hexStripZeros(await ethers.provider.getStorageAt(trustMinimizedProxy.address, ADMIN_SLOT)));
      expect(adminAddress).to.equal(otherAccount.address);
    });
    it("changeAdmin(address newAdm): should fallback to proxy logic execution if called by not an admin", async()=>{
      const { owner, otherAccount, trustMinimizedProxy } = await loadFixture(trustMinimizedProxyFirstLogicSetFixture);
      await expect(await trustMinimizedProxy.connect(otherAccount).changeAdmin(otherAccount.address)).not.to.be.reverted.not.to.emit(trustMinimizedProxy,"AdminChanged");
    });
    it("upgrade(bytes calldata data): should upgrade logic slot to next logic slot if called by admin", async()=>{
      const { trustMinimizedProxy} = await loadFixture(trustMinimizedProxyFirstLogicSetFixture);
      await expect(trustMinimizedProxy.upgrade("0x")).to.emit(trustMinimizedProxy, "Upgraded");
      const logic = await ethers.provider.getStorageAt(trustMinimizedProxy.address, LOGIC_SLOT);
      const nextLogic = await ethers.provider.getStorageAt(trustMinimizedProxy.address, NEXT_LOGIC_SLOT);
      expect(logic).to.equal(nextLogic);
    });
    it("upgrade(bytes calldata data): should fallback to proxy logic execution if called by not an admin", async()=>{
      const { otherAccount,trustMinimizedProxy } = await loadFixture(trustMinimizedProxyFirstLogicSetFixture);
      expect(await trustMinimizedProxy.connect(otherAccount).upgrade("0x")).not.to.be.reverted.not.to.emit(trustMinimizedProxy,"Upgraded");
    });
    it("cancelUpgrade(): should cancel upgrade to next logic slot if called by admin", async()=>{
      const { trustMinimizedProxy } = await loadFixture(trustMinimizedProxyFirstLogicSetFixture);
      await expect(trustMinimizedProxy.cancelUpgrade()).to.emit(trustMinimizedProxy, "NextLogicCanceled");
      const logic = await ethers.provider.getStorageAt(trustMinimizedProxy.address, LOGIC_SLOT);
      const nextLogic = await ethers.provider.getStorageAt(trustMinimizedProxy.address, NEXT_LOGIC_SLOT);
      expect(logic).to.equal(nextLogic);
    });
    it("cancelUpgrade(): should fallback to proxy logic execution if called by not an admin", async()=>{
      const { otherAccount,trustMinimizedProxy } = await loadFixture(trustMinimizedProxyFirstLogicSetFixture);
      expect(await trustMinimizedProxy.connect(otherAccount).cancelUpgrade()).not.to.be.reverted.not.to.emit(trustMinimizedProxy,"NextLogicCanceled");
    });
    it("prolongLock(uint b): should increase PROPOSE_BLOCK_SLOT value if called by admin", async()=>{
      const { trustMinimizedProxy } = await loadFixture(trustMinimizedProxyFirstLogicSetFixture);
      const proposeBlockInitial = await ethers.provider.getStorageAt(trustMinimizedProxy.address, PROPOSE_BLOCK_SLOT);
      const arg = 1;
      await expect(trustMinimizedProxy.prolongLock(arg)).to.emit(trustMinimizedProxy, "ProposingUpgradesRestrictedUntil");
      const proposeBlock= await ethers.provider.getStorageAt(trustMinimizedProxy.address, PROPOSE_BLOCK_SLOT);
      expect(ethers.BigNumber.from(proposeBlockInitial).add(ethers.BigNumber.from(arg))).to.equal(proposeBlock);
    });
    it("prolongLock(uint b): should increase PROPOSE_BLOCK_SLOT value to max uint256 if called by admin", async()=>{
      const { trustMinimizedProxy } = await loadFixture(trustMinimizedProxyFirstLogicSetFixture);
      const proposeBlockInitial = await ethers.provider.getStorageAt(trustMinimizedProxy.address, PROPOSE_BLOCK_SLOT);
      const arg = ethers.constants.MaxUint256;
      await expect(trustMinimizedProxy.prolongLock(arg)).to.emit(trustMinimizedProxy, "ProposingUpgradesRestrictedUntil");
      const proposeBlock= await ethers.provider.getStorageAt(trustMinimizedProxy.address, PROPOSE_BLOCK_SLOT);
      expect(ethers.BigNumber.from(proposeBlockInitial).add(ethers.BigNumber.from(arg))).to.equal(proposeBlock);
    });
    it("prolongLock(uint b): should fallback to proxy logic execution if called by not an admin", async()=>{
      const { otherAccount,trustMinimizedProxy } = await loadFixture(trustMinimizedProxyFirstLogicSetFixture);
      const proposeBlockInitial = await ethers.provider.getStorageAt(trustMinimizedProxy.address, PROPOSE_BLOCK_SLOT);
      const arg = 1;
      expect(await trustMinimizedProxy.connect(otherAccount).prolongLock(arg)).not.to.be.reverted.not.to.emit(trustMinimizedProxy,"ProposingUpgradesRestrictedUntil");
    });
    it("setZeroTrustPeriod(uint blocks): should change ZERO_TRUST_PERIOD_SLOT value if called by admin",async()=>{
      const { trustMinimizedProxy } = await loadFixture(trustMinimizedProxyFirstLogicSetFixture);
      const valInitial = await ethers.provider.getStorageAt(trustMinimizedProxy.address, ZERO_TRUST_PERIOD_SLOT);
      const arg = 1;
      await expect(trustMinimizedProxy.setZeroTrustPeriod(arg)).to.emit(trustMinimizedProxy, "ZeroTrustPeriodSet");
      const val= await ethers.provider.getStorageAt(trustMinimizedProxy.address, ZERO_TRUST_PERIOD_SLOT);
      expect(ethers.BigNumber.from(valInitial).add(ethers.BigNumber.from(arg))).to.equal(val);
    });
    it("setZeroTrustPeriod(uint blocks): should fail to change ZERO_TRUST_PERIOD_SLOT value to max uint256 if called by admin",async()=>{
      const { trustMinimizedProxy } = await loadFixture(trustMinimizedProxyFirstLogicSetFixture);
      const valInitial = await ethers.provider.getStorageAt(trustMinimizedProxy.address, ZERO_TRUST_PERIOD_SLOT);
      const arg = ethers.constants.MaxUint256;
      await expect(trustMinimizedProxy.setZeroTrustPeriod(arg)).to.be.reverted;
      const val= await ethers.provider.getStorageAt(trustMinimizedProxy.address, ZERO_TRUST_PERIOD_SLOT);
      expect(valInitial).to.equal(val);
    });
    it("setZeroTrustPeriod(uint blocks): should fallback to proxy logic execution if called by not an admin", async()=>{
      const { otherAccount,trustMinimizedProxy } = await loadFixture(trustMinimizedProxyFirstLogicSetFixture);
      const valInitial = await ethers.provider.getStorageAt(trustMinimizedProxy.address, ZERO_TRUST_PERIOD_SLOT);
      const arg = 1;
      expect(await trustMinimizedProxy.connect(otherAccount).setZeroTrustPeriod(arg)).not.to.be.reverted.not.to.emit(trustMinimizedProxy,"ZeroTrustPeriodSet");
    });
    it("proposeTo(address newLogic, bytes calldata data): should upgrade if called by admin",async()=>{
      const { otherAccount,trustMinimizedProxy} = await loadFixture(trustMinimizedProxyFirstLogicSetFixture);
      await expect(trustMinimizedProxy.proposeTo(otherAccount.address,"0x")).to.emit(trustMinimizedProxy, "Upgraded").withArgs(otherAccount.address);
      const logic = ethers.utils.getAddress(ethers.utils.hexStripZeros(await ethers.provider.getStorageAt(trustMinimizedProxy.address, LOGIC_SLOT)));
      expect(logic).to.equal(otherAccount.address);
    });
    it("proposeTo(address newLogic, bytes calldata data): should fallback to proxy logic execution if called by not an admin", async()=>{
      const { owner,otherAccount,trustMinimizedProxy } = await loadFixture(trustMinimizedProxyFirstLogicSetFixture);
      const logicInit = await ethers.provider.getStorageAt(trustMinimizedProxy.address, LOGIC_SLOT);
    expect(await trustMinimizedProxy.connect(otherAccount).proposeTo(owner.address,"0x")).not.to.be.reverted.not.to.emit(trustMinimizedProxy,"Upgraded");
    });
  });

  describe("AFTER ZEROTRUSTPERIODSET",()=>{
    describe("If nextLogicBlock wasn't reached yet",()=>{
      it("changeAdmin(address newAdm): should change admin if called by admin", async()=>{
        const { owner, otherAccount, trustMinimizedProxy } = await loadFixture(trustMinimizedProxyZeroTrustPeriodSetFixture);
        await expect(trustMinimizedProxy.changeAdmin(otherAccount.address)).to.emit(trustMinimizedProxy, "AdminChanged").withArgs(owner.address,otherAccount.address);
        const adminAddress = ethers.utils.getAddress(ethers.utils.hexStripZeros(await ethers.provider.getStorageAt(trustMinimizedProxy.address, ADMIN_SLOT)));
        expect(adminAddress).to.equal(otherAccount.address);
      });
      it("changeAdmin(address newAdm): should fallback to proxy logic execution if called by not an admin", async()=>{
        const { owner, otherAccount, trustMinimizedProxy } = await loadFixture(trustMinimizedProxyZeroTrustPeriodSetFixture);
        const tx = await trustMinimizedProxy.connect(otherAccount).changeAdmin(otherAccount.address);
        await expect(tx).not.to.be.reverted.to.not.emit(trustMinimizedProxy, "AdminChanged");
        const adminAddress = ethers.utils.getAddress(ethers.utils.hexStripZeros(await ethers.provider.getStorageAt(trustMinimizedProxy.address, ADMIN_SLOT)));
        expect(adminAddress).not.to.equal(otherAccount.address);
      });
      it("upgrade(bytes calldata data): should fail to upgrade logic slot to next logic slot if called by admin", async()=>{
        const { trustMinimizedProxy} = await loadFixture(trustMinimizedProxyZeroTrustPeriodSetFixture);
        await expect(trustMinimizedProxy.upgrade("0x")).to.be.reverted;
      });
      it("upgrade(bytes calldata data): should fallback to proxy logic execution if called by not an admin", async()=>{
        const { otherAccount,trustMinimizedProxy } = await loadFixture(trustMinimizedProxyZeroTrustPeriodSetFixture);
        const tx = await trustMinimizedProxy.connect(otherAccount).upgrade("0x");
        await expect(tx).not.to.be.reverted.to.not.emit(trustMinimizedProxy, "Upgraded");
      });
      it("cancelUpgrade(): should cancel upgrade to next logic slot if called by admin", async()=>{
        const { trustMinimizedProxy } = await loadFixture(trustMinimizedProxyZeroTrustPeriodSetFixture);
        await expect(trustMinimizedProxy.cancelUpgrade()).to.emit(trustMinimizedProxy, "NextLogicCanceled");
        const logic = await ethers.provider.getStorageAt(trustMinimizedProxy.address, LOGIC_SLOT);
        const nextLogic = await ethers.provider.getStorageAt(trustMinimizedProxy.address, NEXT_LOGIC_SLOT);
        expect(logic).to.equal(nextLogic);
      });
      it("cancelUpgrade(): should fallback to proxy logic execution if called by not an admin", async()=>{
        const { otherAccount,trustMinimizedProxy } = await loadFixture(trustMinimizedProxyZeroTrustPeriodSetFixture);
        const tx = await trustMinimizedProxy.connect(otherAccount).cancelUpgrade();
        await expect(tx).not.to.be.reverted.to.not.emit(trustMinimizedProxy, "NextLogicCanceled");
      });
      it("prolongLock(uint b): should increase PROPOSE_BLOCK_SLOT value if called by admin", async()=>{
        const { trustMinimizedProxy } = await loadFixture(trustMinimizedProxyZeroTrustPeriodSetFixture);
        const proposeBlockInitial = await ethers.provider.getStorageAt(trustMinimizedProxy.address, PROPOSE_BLOCK_SLOT);
        const arg = 1;
        await expect(trustMinimizedProxy.prolongLock(arg)).to.emit(trustMinimizedProxy, "ProposingUpgradesRestrictedUntil");
        const proposeBlock= await ethers.provider.getStorageAt(trustMinimizedProxy.address, PROPOSE_BLOCK_SLOT);
        expect(ethers.BigNumber.from(proposeBlockInitial).add(ethers.BigNumber.from(arg))).to.equal(proposeBlock);
      });
      it("prolongLock(uint b): should fail to increase PROPOSE_BLOCK_SLOT value to max uint256 if called by admin", async()=>{
        const { trustMinimizedProxy } = await loadFixture(trustMinimizedProxyZeroTrustPeriodSetFixture);
        const proposeBlockInitial = await ethers.provider.getStorageAt(trustMinimizedProxy.address, PROPOSE_BLOCK_SLOT);
        const arg = ethers.constants.MaxUint256;
        await expect(trustMinimizedProxy.prolongLock(arg)).to.be.reverted;
      });
      it("prolongLock(uint b): should fallback to proxy logic execution if called by not an admin", async()=>{
        const { otherAccount,trustMinimizedProxy } = await loadFixture(trustMinimizedProxyZeroTrustPeriodSetFixture);
        const proposeBlockInitial = await ethers.provider.getStorageAt(trustMinimizedProxy.address, PROPOSE_BLOCK_SLOT);
        const arg = 1;
        const tx = await trustMinimizedProxy.connect(otherAccount).prolongLock(arg);
        await expect(tx).not.to.be.reverted.to.not.emit(trustMinimizedProxy, "ProposingUpgradesRestrictedUntil");
        const proposeBlock= await ethers.provider.getStorageAt(trustMinimizedProxy.address, PROPOSE_BLOCK_SLOT);
        expect(proposeBlockInitial).to.equal(proposeBlock);
      });
      it("setZeroTrustPeriod(uint blocks): should change ZERO_TRUST_PERIOD_SLOT value if called by admin and the value is higher than previous",async()=>{
        const { trustMinimizedProxy } = await loadFixture(trustMinimizedProxyZeroTrustPeriodSetFixture);
        const arg = 3;
        await expect(trustMinimizedProxy.setZeroTrustPeriod(arg)).to.emit(trustMinimizedProxy, "ZeroTrustPeriodSet");
        const val= await ethers.provider.getStorageAt(trustMinimizedProxy.address, ZERO_TRUST_PERIOD_SLOT);
        expect(arg).to.equal(parseInt(ethers.utils.hexStripZeros(val)));
      });
      it("setZeroTrustPeriod(uint blocks): should fail to change ZERO_TRUST_PERIOD_SLOT value to max uint256 if called by admin",async()=>{
        const { trustMinimizedProxy } = await loadFixture(trustMinimizedProxyZeroTrustPeriodSetFixture);
        const valInitial = await ethers.provider.getStorageAt(trustMinimizedProxy.address, ZERO_TRUST_PERIOD_SLOT);
        const arg = ethers.constants.MaxUint256;
        await expect(trustMinimizedProxy.setZeroTrustPeriod(arg)).to.be.reverted;
        const val = await ethers.provider.getStorageAt(trustMinimizedProxy.address, ZERO_TRUST_PERIOD_SLOT);
        expect(valInitial).to.equal(val);
      });
      it("setZeroTrustPeriod(uint blocks): should fail to change value if called by admin and the value is not higher than previous",async()=>{
        const { trustMinimizedProxy } = await loadFixture(trustMinimizedProxyZeroTrustPeriodSetFixture);
        const valInitial = await ethers.provider.getStorageAt(trustMinimizedProxy.address, ZERO_TRUST_PERIOD_SLOT);
        const arg = 1;
        await expect(trustMinimizedProxy.setZeroTrustPeriod(arg)).to.be.reverted;
        const val= await ethers.provider.getStorageAt(trustMinimizedProxy.address, ZERO_TRUST_PERIOD_SLOT);
        expect(valInitial).to.equal(val);
      });
      it("setZeroTrustPeriod(uint blocks): should fallback to proxy logic execution if called by not an admin", async()=>{
        const { otherAccount,trustMinimizedProxy } = await loadFixture(trustMinimizedProxyZeroTrustPeriodSetFixture);
        const valInitial = await ethers.provider.getStorageAt(trustMinimizedProxy.address, ZERO_TRUST_PERIOD_SLOT);
        const arg = 1;
        const tx = await trustMinimizedProxy.connect(otherAccount).setZeroTrustPeriod(arg);
        await expect(tx).not.to.be.reverted.to.not.emit(trustMinimizedProxy, "ZeroTrustPeriodSet");
        const val= await ethers.provider.getStorageAt(trustMinimizedProxy.address, ZERO_TRUST_PERIOD_SLOT);
        expect(valInitial).to.equal(val);
      });
      it("proposeTo(address newLogic, bytes calldata data): should fail to instantly upgrade if called by admin, sets next logic instead",async()=>{
        const { otherAccount,trustMinimizedProxy} = await loadFixture(trustMinimizedProxyZeroTrustPeriodSetFixture);
        const logicInitial = await ethers.provider.getStorageAt(trustMinimizedProxy.address, LOGIC_SLOT);
        const nextLogicInitial = await ethers.provider.getStorageAt(trustMinimizedProxy.address, NEXT_LOGIC_SLOT);
        await expect(trustMinimizedProxy.proposeTo(otherAccount.address,"0x")).to.emit(trustMinimizedProxy, "NextLogicDefined");
        const logic = await ethers.provider.getStorageAt(trustMinimizedProxy.address, LOGIC_SLOT);
        const nextLogic = await ethers.provider.getStorageAt(trustMinimizedProxy.address, NEXT_LOGIC_SLOT);
        expect(logic).to.equal(logicInitial);
        expect(nextLogic).to.not.equal(nextLogicInitial);
      });
      it("proposeTo(address newLogic, bytes calldata data): should fallback to proxy logic execution if called by not an admin", async()=>{
        const { owner,otherAccount,trustMinimizedProxy } = await loadFixture(trustMinimizedProxyZeroTrustPeriodSetFixture);
        const logicInit = await ethers.provider.getStorageAt(trustMinimizedProxy.address, LOGIC_SLOT);
        const tx = await trustMinimizedProxy.connect(otherAccount).proposeTo(owner.address,"0x");
        await expect(tx).not.to.be.reverted.to.not.emit(trustMinimizedProxy, "Upgraded");
        const logic = await ethers.provider.getStorageAt(trustMinimizedProxy.address, LOGIC_SLOT);
        expect(logic).to.equal(logicInit);
      });       
    });
    describe("If nextLogicBlock has passed",()=>{
      it("changeAdmin(address newAdm): should change admin if called by admin", async()=>{
        const { owner, otherAccount, trustMinimizedProxy } = await loadFixture(trustMinimizedProxyZeroTrustPeriodSetNextLogicBlockPassedFixture);
        await expect(trustMinimizedProxy.changeAdmin(otherAccount.address)).to.emit(trustMinimizedProxy, "AdminChanged").withArgs(owner.address,otherAccount.address);
        const adminAddress = ethers.utils.getAddress(ethers.utils.hexStripZeros(await ethers.provider.getStorageAt(trustMinimizedProxy.address, ADMIN_SLOT)));
        expect(adminAddress).to.equal(otherAccount.address);
      });
      it("changeAdmin(address newAdm): should fallback to proxy logic execution if called by not an admin", async()=>{
        const { owner, otherAccount, trustMinimizedProxy } = await loadFixture(trustMinimizedProxyZeroTrustPeriodSetNextLogicBlockPassedFixture);
        const tx = await trustMinimizedProxy.connect(otherAccount).changeAdmin(otherAccount.address);
        await expect(tx).not.to.be.reverted.to.not.emit(trustMinimizedProxy, "AdminChanged");;
        const adminAddress = ethers.utils.getAddress(ethers.utils.hexStripZeros(await ethers.provider.getStorageAt(trustMinimizedProxy.address, ADMIN_SLOT)));
        expect(adminAddress).not.to.equal(otherAccount.address);
      });
      it("upgrade(bytes calldata data): should upgrade logic slot to next logic slot if called by admin", async()=>{
        const { trustMinimizedProxy} = await loadFixture(trustMinimizedProxyZeroTrustPeriodSetNextLogicBlockPassedFixture);
        await expect(trustMinimizedProxy.upgrade("0x")).to.emit(trustMinimizedProxy, "Upgraded");
        const logic = await ethers.provider.getStorageAt(trustMinimizedProxy.address, LOGIC_SLOT);
        const nextLogic = await ethers.provider.getStorageAt(trustMinimizedProxy.address, NEXT_LOGIC_SLOT);
        expect(logic).to.equal(nextLogic);
      });
      it("upgrade(bytes calldata data): should fallback to proxy logic execution if called by not an admin", async()=>{
        const { otherAccount,trustMinimizedProxy } = await loadFixture(trustMinimizedProxyZeroTrustPeriodSetNextLogicBlockPassedFixture);
        const tx = await trustMinimizedProxy.connect(otherAccount).upgrade("0x");
        await expect(tx).not.to.be.reverted.to.not.emit(trustMinimizedProxy, "Upgraded");
      });
      it("cancelUpgrade(): should cancel upgrade to next logic slot if called by admin", async()=>{
        const { trustMinimizedProxy } = await loadFixture(trustMinimizedProxyZeroTrustPeriodSetNextLogicBlockPassedFixture);
        await expect(trustMinimizedProxy.cancelUpgrade()).to.emit(trustMinimizedProxy, "NextLogicCanceled");
        const logic = await ethers.provider.getStorageAt(trustMinimizedProxy.address, LOGIC_SLOT);
        const nextLogic = await ethers.provider.getStorageAt(trustMinimizedProxy.address, NEXT_LOGIC_SLOT);
        expect(logic).to.equal(nextLogic);
      });
      it("cancelUpgrade(): should fallback to proxy logic execution if called by not an admin", async()=>{
        const { otherAccount,trustMinimizedProxy } = await loadFixture(trustMinimizedProxyZeroTrustPeriodSetNextLogicBlockPassedFixture);
        const tx = await trustMinimizedProxy.connect(otherAccount).cancelUpgrade();
        await expect(tx).not.to.be.reverted.to.not.emit(trustMinimizedProxy, "NextLogicCanceled");
      });
      it("prolongLock(uint b): should increase PROPOSE_BLOCK_SLOT value if called by admin", async()=>{
        const { trustMinimizedProxy } = await loadFixture(trustMinimizedProxyZeroTrustPeriodSetNextLogicBlockPassedFixture);
        const proposeBlockInitial = await ethers.provider.getStorageAt(trustMinimizedProxy.address, PROPOSE_BLOCK_SLOT);
        const arg = 1;
        await expect(trustMinimizedProxy.prolongLock(arg)).to.emit(trustMinimizedProxy, "ProposingUpgradesRestrictedUntil");
        const proposeBlock= await ethers.provider.getStorageAt(trustMinimizedProxy.address, PROPOSE_BLOCK_SLOT);
        expect(ethers.BigNumber.from(proposeBlockInitial).add(ethers.BigNumber.from(arg))).to.equal(proposeBlock);
      });
      it("prolongLock(uint b): should fail to increase PROPOSE_BLOCK_SLOT value to max uint256 if called by admin", async()=>{
        const { trustMinimizedProxy } = await loadFixture(trustMinimizedProxyZeroTrustPeriodSetNextLogicBlockPassedFixture);
        const proposeBlockInitial = await ethers.provider.getStorageAt(trustMinimizedProxy.address, PROPOSE_BLOCK_SLOT);
        const arg = ethers.constants.MaxUint256;
        await expect(trustMinimizedProxy.prolongLock(arg)).to.be.reverted;
        const proposeBlock= await ethers.provider.getStorageAt(trustMinimizedProxy.address, PROPOSE_BLOCK_SLOT);
      });
      it("prolongLock(uint b): should fallback to proxy logic execution if called by not an admin", async()=>{
        const { otherAccount,trustMinimizedProxy } = await loadFixture(trustMinimizedProxyZeroTrustPeriodSetNextLogicBlockPassedFixture);
        const proposeBlockInitial = await ethers.provider.getStorageAt(trustMinimizedProxy.address, PROPOSE_BLOCK_SLOT);
        const arg = 1;
        const tx = await trustMinimizedProxy.connect(otherAccount).prolongLock(arg);
        await expect(tx).not.to.be.reverted.to.not.emit(trustMinimizedProxy, "ProposingUpgradesRestrictedUntil");
        const proposeBlock= await ethers.provider.getStorageAt(trustMinimizedProxy.address, PROPOSE_BLOCK_SLOT);
        expect(proposeBlockInitial).to.equal(proposeBlock);
      });
      it("setZeroTrustPeriod(uint blocks): should change ZERO_TRUST_PERIOD_SLOT value if called by admin",async()=>{
        const { trustMinimizedProxy } = await loadFixture(trustMinimizedProxyZeroTrustPeriodSetNextLogicBlockPassedFixture);
        const valInitial = await ethers.provider.getStorageAt(trustMinimizedProxy.address, ZERO_TRUST_PERIOD_SLOT);
        const arg = 2;
        await expect(trustMinimizedProxy.setZeroTrustPeriod(arg)).to.emit(trustMinimizedProxy, "ZeroTrustPeriodSet");
        const val= await ethers.provider.getStorageAt(trustMinimizedProxy.address, ZERO_TRUST_PERIOD_SLOT);
        expect(arg).to.equal(parseInt(ethers.utils.hexStripZeros(val)));
      });
      it("setZeroTrustPeriod(uint blocks): should fail to change ZERO_TRUST_PERIOD_SLOT value to max uint256 if called by admin",async()=>{
        const { trustMinimizedProxy } = await loadFixture(trustMinimizedProxyZeroTrustPeriodSetNextLogicBlockPassedFixture);
        const valInitial = await ethers.provider.getStorageAt(trustMinimizedProxy.address, ZERO_TRUST_PERIOD_SLOT);
        const arg = ethers.constants.MaxUint256;
        await expect(trustMinimizedProxy.setZeroTrustPeriod(arg)).to.be.reverted;
        const val= await ethers.provider.getStorageAt(trustMinimizedProxy.address, ZERO_TRUST_PERIOD_SLOT);
        expect(valInitial).to.equal(val);
      });
      it("setZeroTrustPeriod(uint blocks): should fail to change value if called by admin and the value is not higher than previous",async()=>{
        const { trustMinimizedProxy } = await loadFixture(trustMinimizedProxyZeroTrustPeriodSetNextLogicBlockPassedFixture);
        const valInitial = await ethers.provider.getStorageAt(trustMinimizedProxy.address, ZERO_TRUST_PERIOD_SLOT);
        const arg = 1;
        await expect(trustMinimizedProxy.setZeroTrustPeriod(arg)).to.be.reverted;///alert
        const val= await ethers.provider.getStorageAt(trustMinimizedProxy.address, ZERO_TRUST_PERIOD_SLOT);
        expect(valInitial).to.equal(val);
      });
      it("setZeroTrustPeriod(uint blocks): should fallback to proxy logic execution if called by not an admin", async()=>{
        const { otherAccount,trustMinimizedProxy } = await loadFixture(trustMinimizedProxyZeroTrustPeriodSetNextLogicBlockPassedFixture);
        const valInitial = await ethers.provider.getStorageAt(trustMinimizedProxy.address, ZERO_TRUST_PERIOD_SLOT);
        const arg = 1;
        const tx = await trustMinimizedProxy.connect(otherAccount).setZeroTrustPeriod(arg);
        await expect(tx).not.to.be.reverted.to.not.emit(trustMinimizedProxy, "ZeroTrustPeriodSet");
        const val= await ethers.provider.getStorageAt(trustMinimizedProxy.address, ZERO_TRUST_PERIOD_SLOT);
        expect(valInitial).to.equal(val);
      });
      it("proposeTo(address newLogic, bytes calldata data): should upgrade if called by admin",async()=>{
        const { otherAccount,trustMinimizedProxy} = await loadFixture(trustMinimizedProxyZeroTrustPeriodSetNextLogicBlockPassedFixture);
        await expect(trustMinimizedProxy.proposeTo(otherAccount.address,"0x")).to.emit(trustMinimizedProxy, "NextLogicDefined");
        const logic = ethers.utils.getAddress(ethers.utils.hexStripZeros(await ethers.provider.getStorageAt(trustMinimizedProxy.address, NEXT_LOGIC_SLOT)));
        expect(logic).to.equal(otherAccount.address);
      });
      it("proposeTo(address newLogic, bytes calldata data): should fallback to proxy logic execution if called by not an admin", async()=>{
        const { owner,otherAccount,trustMinimizedProxy } = await loadFixture(trustMinimizedProxyZeroTrustPeriodSetNextLogicBlockPassedFixture);
        const logicInit = await ethers.provider.getStorageAt(trustMinimizedProxy.address, LOGIC_SLOT);
        const tx = await trustMinimizedProxy.connect(otherAccount).proposeTo(owner.address,"0x");
        await expect(tx).not.to.be.reverted.to.not.emit(trustMinimizedProxy, "Upgraded");
        const logic = await ethers.provider.getStorageAt(trustMinimizedProxy.address, LOGIC_SLOT);
        expect(logic).to.equal(logicInit);
      }); 
    });
  });

  describe("AFTER ZERO TRUST PERIOD SET AND FIRST LOGIC SET",()=>{
    describe("If nextLogicBlock wasn't reached yet",()=>{
      it("changeAdmin(address newAdm): should change admin if called by admin", async()=>{
        const { owner, otherAccount, trustMinimizedProxy } = await loadFixture(zeroTrustPeriodSetFirstLogicSetFixture);
        await expect(trustMinimizedProxy.changeAdmin(otherAccount.address)).to.emit(trustMinimizedProxy, "AdminChanged").withArgs(owner.address,otherAccount.address);
        const adminAddress = ethers.utils.getAddress(ethers.utils.hexStripZeros(await ethers.provider.getStorageAt(trustMinimizedProxy.address, ADMIN_SLOT)));
        expect(adminAddress).to.equal(otherAccount.address);
      });
      it("changeAdmin(address newAdm): should fallback to proxy logic execution if called by not an admin", async()=>{
        const { owner, otherAccount, trustMinimizedProxy } = await loadFixture(zeroTrustPeriodSetFirstLogicSetFixture);
        const tx = await trustMinimizedProxy.connect(otherAccount).changeAdmin(otherAccount.address);
        await expect(tx).not.to.be.reverted.to.not.emit(trustMinimizedProxy, "AdminChanged");;
        const adminAddress = ethers.utils.getAddress(ethers.utils.hexStripZeros(await ethers.provider.getStorageAt(trustMinimizedProxy.address, ADMIN_SLOT)));
        expect(adminAddress).not.to.equal(otherAccount.address);
      });
      it("upgrade(bytes calldata data): should fail to upgrade logic slot to next logic slot if called by admin", async()=>{
        const { trustMinimizedProxy} = await loadFixture(zeroTrustPeriodSetFirstLogicSetFixture);
        await expect(trustMinimizedProxy.upgrade("0x")).to.be.reverted;
      });
      it("upgrade(bytes calldata data): should fallback to proxy logic execution if called by not an admin", async()=>{
        const { otherAccount,trustMinimizedProxy } = await loadFixture(zeroTrustPeriodSetFirstLogicSetFixture);
        const tx = await trustMinimizedProxy.connect(otherAccount).upgrade("0x");
        await expect(tx).not.to.be.reverted.to.not.emit(trustMinimizedProxy, "Upgraded");
      });
      it("cancelUpgrade(): should cancel upgrade to next logic slot if called by admin", async()=>{
        const { trustMinimizedProxy } = await loadFixture(zeroTrustPeriodSetFirstLogicSetFixture);
        await expect(trustMinimizedProxy.cancelUpgrade()).to.emit(trustMinimizedProxy, "NextLogicCanceled");
        const logic = await ethers.provider.getStorageAt(trustMinimizedProxy.address, LOGIC_SLOT);
        const nextLogic = await ethers.provider.getStorageAt(trustMinimizedProxy.address, NEXT_LOGIC_SLOT);
        expect(logic).to.equal(nextLogic);
      });
      it("cancelUpgrade(): should fallback to proxy logic execution if called by not an admin", async()=>{
        const { otherAccount,trustMinimizedProxy } = await loadFixture(zeroTrustPeriodSetFirstLogicSetFixture);
        const tx = await trustMinimizedProxy.connect(otherAccount).cancelUpgrade();
        await expect(tx).not.to.be.reverted.to.not.emit(trustMinimizedProxy, "NextLogicCanceled");
      });
      it("prolongLock(uint b): should increase PROPOSE_BLOCK_SLOT value if called by admin", async()=>{
        const { trustMinimizedProxy } = await loadFixture(zeroTrustPeriodSetFirstLogicSetFixture);
        const proposeBlockInitial = await ethers.provider.getStorageAt(trustMinimizedProxy.address, PROPOSE_BLOCK_SLOT);
        const arg = 1;
        await expect(trustMinimizedProxy.prolongLock(arg)).to.emit(trustMinimizedProxy, "ProposingUpgradesRestrictedUntil");
        const proposeBlock= await ethers.provider.getStorageAt(trustMinimizedProxy.address, PROPOSE_BLOCK_SLOT);
        expect(ethers.BigNumber.from(proposeBlockInitial).add(ethers.BigNumber.from(arg))).to.equal(proposeBlock);
      });
      it("prolongLock(uint b): should fail to increase PROPOSE_BLOCK_SLOT value to max uint256 if called by admin", async()=>{
        const { trustMinimizedProxy } = await loadFixture(zeroTrustPeriodSetFirstLogicSetFixture);
        const proposeBlockInitial = await ethers.provider.getStorageAt(trustMinimizedProxy.address, PROPOSE_BLOCK_SLOT);
        const arg = ethers.constants.MaxUint256;
        await expect(trustMinimizedProxy.prolongLock(arg)).to.be.reverted;
      });
      it("prolongLock(uint b): should fallback to proxy logic execution if called by not an admin", async()=>{
        const { otherAccount,trustMinimizedProxy } = await loadFixture(zeroTrustPeriodSetFirstLogicSetFixture);
        const proposeBlockInitial = await ethers.provider.getStorageAt(trustMinimizedProxy.address, PROPOSE_BLOCK_SLOT);
        const arg = 1;
        const tx = await trustMinimizedProxy.connect(otherAccount).prolongLock(arg);
        await expect(tx).not.to.be.reverted.to.not.emit(trustMinimizedProxy, "ProposingUpgradesRestrictedUntil");
        const proposeBlock= await ethers.provider.getStorageAt(trustMinimizedProxy.address, PROPOSE_BLOCK_SLOT);
        expect(proposeBlockInitial).to.equal(proposeBlock);
      });
      it("setZeroTrustPeriod(uint blocks): should change ZERO_TRUST_PERIOD_SLOT value if called by admin and the value is higher than previous",async()=>{
        const { trustMinimizedProxy } = await loadFixture(zeroTrustPeriodSetFirstLogicSetFixture);
        const arg = 3;
        await expect(trustMinimizedProxy.setZeroTrustPeriod(arg)).to.emit(trustMinimizedProxy, "ZeroTrustPeriodSet");
        const val= await ethers.provider.getStorageAt(trustMinimizedProxy.address, ZERO_TRUST_PERIOD_SLOT);
        expect(arg).to.equal(parseInt(ethers.utils.hexStripZeros(val)));
      });
      it("setZeroTrustPeriod(uint blocks): should fail to change ZERO_TRUST_PERIOD_SLOT value to max uint256 if called by admin",async()=>{
        const { trustMinimizedProxy } = await loadFixture(zeroTrustPeriodSetFirstLogicSetFixture);
        const valInitial = await ethers.provider.getStorageAt(trustMinimizedProxy.address, ZERO_TRUST_PERIOD_SLOT);
        const arg = ethers.constants.MaxUint256;
        await expect(trustMinimizedProxy.setZeroTrustPeriod(arg)).to.be.reverted;
        const val= await ethers.provider.getStorageAt(trustMinimizedProxy.address, ZERO_TRUST_PERIOD_SLOT);
        expect(valInitial).to.equal(val);
      });
      it("setZeroTrustPeriod(uint blocks): should fail to change value if called by admin and the value is not higher than previous",async()=>{
        const { trustMinimizedProxy } = await loadFixture(zeroTrustPeriodSetFirstLogicSetFixture);
        const valInitial = await ethers.provider.getStorageAt(trustMinimizedProxy.address, ZERO_TRUST_PERIOD_SLOT);
        const arg = 1;
        await expect(trustMinimizedProxy.setZeroTrustPeriod(arg)).to.be.reverted;
        const val= await ethers.provider.getStorageAt(trustMinimizedProxy.address, ZERO_TRUST_PERIOD_SLOT);
        expect(valInitial).to.equal(val);
      });
      it("setZeroTrustPeriod(uint blocks): should fallback to proxy logic execution if called by not an admin", async()=>{
        const { otherAccount,trustMinimizedProxy } = await loadFixture(zeroTrustPeriodSetFirstLogicSetFixture);
        const valInitial = await ethers.provider.getStorageAt(trustMinimizedProxy.address, ZERO_TRUST_PERIOD_SLOT);
        const arg = 1;
        const tx = await trustMinimizedProxy.connect(otherAccount).setZeroTrustPeriod(arg);
        await expect(tx).not.to.be.reverted.to.not.emit(trustMinimizedProxy, "ZeroTrustPeriodSet");
        const val= await ethers.provider.getStorageAt(trustMinimizedProxy.address, ZERO_TRUST_PERIOD_SLOT);
        expect(valInitial).to.equal(val);
      });
      it("proposeTo(address newLogic, bytes calldata data): should fail to instantly upgrade if called by admin, sets next logic instead",async()=>{
        const { otherAccount,trustMinimizedProxy} = await loadFixture(zeroTrustPeriodSetFirstLogicSetFixture);
        const logicInitial = await ethers.provider.getStorageAt(trustMinimizedProxy.address, LOGIC_SLOT);
        const nextLogicInitial = await ethers.provider.getStorageAt(trustMinimizedProxy.address, NEXT_LOGIC_SLOT);
        await expect(trustMinimizedProxy.proposeTo(otherAccount.address,"0x")).to.emit(trustMinimizedProxy, "NextLogicDefined");
        const logic = await ethers.provider.getStorageAt(trustMinimizedProxy.address, LOGIC_SLOT);
        const nextLogic = await ethers.provider.getStorageAt(trustMinimizedProxy.address, NEXT_LOGIC_SLOT);
        expect(logic).to.equal(logicInitial);
        expect(nextLogic).to.not.equal(nextLogicInitial);
      });
      it("proposeTo(address newLogic, bytes calldata data): should fallback to proxy logic execution if called by not an admin", async()=>{
        const { owner,otherAccount,trustMinimizedProxy } = await loadFixture(zeroTrustPeriodSetFirstLogicSetFixture);
        const logicInit = await ethers.provider.getStorageAt(trustMinimizedProxy.address, LOGIC_SLOT);
        const tx = await trustMinimizedProxy.connect(otherAccount).proposeTo(owner.address,"0x");
        await expect(tx).not.to.be.reverted.to.not.emit(trustMinimizedProxy, "Upgraded");
        const logic = await ethers.provider.getStorageAt(trustMinimizedProxy.address, LOGIC_SLOT);
        expect(logic).to.equal(logicInit);
      });       
    });
    describe("If nextLogicBlock has passed",()=>{
      it("changeAdmin(address newAdm): should change admin if called by admin", async()=>{
        const { owner, otherAccount, trustMinimizedProxy } = await loadFixture(zeroTrustPeriodSetFirstLogicSetNextLogicBlockPassedFixture);
        await expect(trustMinimizedProxy.changeAdmin(otherAccount.address)).to.emit(trustMinimizedProxy, "AdminChanged").withArgs(owner.address,otherAccount.address);
        const adminAddress = ethers.utils.getAddress(ethers.utils.hexStripZeros(await ethers.provider.getStorageAt(trustMinimizedProxy.address, ADMIN_SLOT)));
        expect(adminAddress).to.equal(otherAccount.address);
      });
      it("changeAdmin(address newAdm): should fallback to proxy logic execution if called by not an admin", async()=>{
        const { owner, otherAccount, trustMinimizedProxy } = await loadFixture(zeroTrustPeriodSetFirstLogicSetNextLogicBlockPassedFixture);
        const tx = await trustMinimizedProxy.connect(otherAccount).changeAdmin(otherAccount.address);
        await expect(tx).not.to.be.reverted.to.not.emit(trustMinimizedProxy, "AdminChanged");;
        const adminAddress = ethers.utils.getAddress(ethers.utils.hexStripZeros(await ethers.provider.getStorageAt(trustMinimizedProxy.address, ADMIN_SLOT)));
        expect(adminAddress).not.to.equal(otherAccount.address);
      });
      it("upgrade(bytes calldata data): should upgrade logic slot to next logic slot if called by admin", async()=>{
        const { trustMinimizedProxy} = await loadFixture(zeroTrustPeriodSetFirstLogicSetNextLogicBlockPassedFixture);
        await expect(trustMinimizedProxy.upgrade("0x")).to.emit(trustMinimizedProxy, "Upgraded");
        const logic = await ethers.provider.getStorageAt(trustMinimizedProxy.address, LOGIC_SLOT);
        const nextLogic = await ethers.provider.getStorageAt(trustMinimizedProxy.address, NEXT_LOGIC_SLOT);
        expect(logic).to.equal(nextLogic);
      });
      it("upgrade(bytes calldata data): should fallback to proxy logic execution if called by not an admin", async()=>{
        const { otherAccount,trustMinimizedProxy } = await loadFixture(zeroTrustPeriodSetFirstLogicSetNextLogicBlockPassedFixture);
        const tx = await trustMinimizedProxy.connect(otherAccount).upgrade("0x");
        await expect(tx).not.to.be.reverted.to.not.emit(trustMinimizedProxy, "Upgraded");
      });
      it("cancelUpgrade(): should cancel upgrade to next logic slot if called by admin", async()=>{
        const { trustMinimizedProxy } = await loadFixture(zeroTrustPeriodSetFirstLogicSetNextLogicBlockPassedFixture);
        await expect(trustMinimizedProxy.cancelUpgrade()).to.emit(trustMinimizedProxy, "NextLogicCanceled");
        const logic = await ethers.provider.getStorageAt(trustMinimizedProxy.address, LOGIC_SLOT);
        const nextLogic = await ethers.provider.getStorageAt(trustMinimizedProxy.address, NEXT_LOGIC_SLOT);
        expect(logic).to.equal(nextLogic);
      });
      it("cancelUpgrade(): should fallback to proxy logic execution if called by not an admin", async()=>{
        const { otherAccount,trustMinimizedProxy } = await loadFixture(zeroTrustPeriodSetFirstLogicSetNextLogicBlockPassedFixture);
        const tx = await trustMinimizedProxy.connect(otherAccount).cancelUpgrade();
        await expect(tx).not.to.be.reverted.to.not.emit(trustMinimizedProxy, "NextLogicCanceled");
      });
      it("prolongLock(uint b): should increase PROPOSE_BLOCK_SLOT value if called by admin", async()=>{
        const { trustMinimizedProxy } = await loadFixture(zeroTrustPeriodSetFirstLogicSetNextLogicBlockPassedFixture);
        const proposeBlockInitial = await ethers.provider.getStorageAt(trustMinimizedProxy.address, PROPOSE_BLOCK_SLOT);
        const arg = 1;
        await expect(trustMinimizedProxy.prolongLock(arg)).to.emit(trustMinimizedProxy, "ProposingUpgradesRestrictedUntil");
        const proposeBlock= await ethers.provider.getStorageAt(trustMinimizedProxy.address, PROPOSE_BLOCK_SLOT);
        expect(ethers.BigNumber.from(proposeBlockInitial).add(ethers.BigNumber.from(arg))).to.equal(proposeBlock);
      });
      it("prolongLock(uint b): should fail to increase PROPOSE_BLOCK_SLOT value to max uint256 if called by admin", async()=>{
        const { trustMinimizedProxy } = await loadFixture(zeroTrustPeriodSetFirstLogicSetNextLogicBlockPassedFixture);
        const proposeBlockInitial = await ethers.provider.getStorageAt(trustMinimizedProxy.address, PROPOSE_BLOCK_SLOT);
        const arg = ethers.constants.MaxUint256;
        await expect(trustMinimizedProxy.prolongLock(arg)).to.be.reverted;
        const proposeBlock= await ethers.provider.getStorageAt(trustMinimizedProxy.address, PROPOSE_BLOCK_SLOT);
      });
      it("prolongLock(uint b): should fallback to proxy logic execution if called by not an admin", async()=>{
        const { otherAccount,trustMinimizedProxy } = await loadFixture(zeroTrustPeriodSetFirstLogicSetNextLogicBlockPassedFixture);
        const proposeBlockInitial = await ethers.provider.getStorageAt(trustMinimizedProxy.address, PROPOSE_BLOCK_SLOT);
        const arg = 1;
        const tx = await trustMinimizedProxy.connect(otherAccount).prolongLock(arg);
        await expect(tx).not.to.be.reverted.to.not.emit(trustMinimizedProxy, "ProposingUpgradesRestrictedUntil");
        const proposeBlock= await ethers.provider.getStorageAt(trustMinimizedProxy.address, PROPOSE_BLOCK_SLOT);
        expect(proposeBlockInitial).to.equal(proposeBlock);
      });
      it("setZeroTrustPeriod(uint blocks): should change ZERO_TRUST_PERIOD_SLOT value if called by admin and the value is higher than previous",async()=>{
        const { trustMinimizedProxy } = await loadFixture(zeroTrustPeriodSetFirstLogicSetNextLogicBlockPassedFixture);
        const valInitial = await ethers.provider.getStorageAt(trustMinimizedProxy.address, ZERO_TRUST_PERIOD_SLOT);
        const arg = 3;
        await expect(trustMinimizedProxy.setZeroTrustPeriod(arg)).to.emit(trustMinimizedProxy, "ZeroTrustPeriodSet");
        const val= await ethers.provider.getStorageAt(trustMinimizedProxy.address, ZERO_TRUST_PERIOD_SLOT);
        expect(arg).to.equal(parseInt(ethers.utils.hexStripZeros(val)));
      });
      it("setZeroTrustPeriod(uint blocks): should fail to change ZERO_TRUST_PERIOD_SLOT value to max uint256 if called by admin",async()=>{
        const { trustMinimizedProxy } = await loadFixture(zeroTrustPeriodSetFirstLogicSetNextLogicBlockPassedFixture);
        const valInitial = await ethers.provider.getStorageAt(trustMinimizedProxy.address, ZERO_TRUST_PERIOD_SLOT);
        const arg = ethers.constants.MaxUint256;
        await expect(trustMinimizedProxy.setZeroTrustPeriod(arg)).to.be.reverted;
        const val= await ethers.provider.getStorageAt(trustMinimizedProxy.address, ZERO_TRUST_PERIOD_SLOT);
        expect(valInitial).to.equal(val);
      });
      it("setZeroTrustPeriod(uint blocks): should fail to change value if called by admin and the value is not higher than previous",async()=>{
        const { trustMinimizedProxy } = await loadFixture(zeroTrustPeriodSetFirstLogicSetNextLogicBlockPassedFixture);
        const valInitial = await ethers.provider.getStorageAt(trustMinimizedProxy.address, ZERO_TRUST_PERIOD_SLOT);
        const arg = 1;
        await expect(trustMinimizedProxy.setZeroTrustPeriod(arg)).to.be.reverted;///alert
        const val= await ethers.provider.getStorageAt(trustMinimizedProxy.address, ZERO_TRUST_PERIOD_SLOT);
        expect(valInitial).to.equal(val);
      });
      it("setZeroTrustPeriod(uint blocks): should fallback to proxy logic execution if called by not an admin", async()=>{
        const { otherAccount,trustMinimizedProxy } = await loadFixture(zeroTrustPeriodSetFirstLogicSetNextLogicBlockPassedFixture);
        const valInitial = await ethers.provider.getStorageAt(trustMinimizedProxy.address, ZERO_TRUST_PERIOD_SLOT);
        const arg = 1;
        const tx = await trustMinimizedProxy.connect(otherAccount).setZeroTrustPeriod(arg);
        await expect(tx).not.to.be.reverted.to.not.emit(trustMinimizedProxy, "ZeroTrustPeriodSet");
        const val= await ethers.provider.getStorageAt(trustMinimizedProxy.address, ZERO_TRUST_PERIOD_SLOT);
        expect(valInitial).to.equal(val);
      });
      it("proposeTo(address newLogic, bytes calldata data): should upgrade if called by admin",async()=>{
        const { otherAccount,trustMinimizedProxy} = await loadFixture(zeroTrustPeriodSetFirstLogicSetNextLogicBlockPassedFixture);
        await expect(trustMinimizedProxy.proposeTo(otherAccount.address,"0x")).to.emit(trustMinimizedProxy, "NextLogicDefined");
        const logic = ethers.utils.getAddress(ethers.utils.hexStripZeros(await ethers.provider.getStorageAt(trustMinimizedProxy.address, NEXT_LOGIC_SLOT)));
        expect(logic).to.equal(otherAccount.address);
      });
      it("proposeTo(address newLogic, bytes calldata data): should fallback to proxy logic execution if called by not an admin", async()=>{
        const { owner,otherAccount,trustMinimizedProxy } = await loadFixture(zeroTrustPeriodSetFirstLogicSetNextLogicBlockPassedFixture);
      const logicInit = await ethers.provider.getStorageAt(trustMinimizedProxy.address, LOGIC_SLOT);
        const tx = await trustMinimizedProxy.connect(otherAccount).proposeTo(owner.address,"0x");
        await expect(tx).not.to.be.reverted.to.not.emit(trustMinimizedProxy, "Upgraded");
        const logic = await ethers.provider.getStorageAt(trustMinimizedProxy.address, LOGIC_SLOT);
        expect(logic).to.equal(logicInit);
      }); 
    });
  });
});
