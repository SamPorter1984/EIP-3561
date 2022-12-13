const { expect } = require("chai");
const {
  deployTrustMinimizedProxyFixture,
  trustMinimizedProxyFirstLogicSetFixture,
  trustMinimizedProxyZeroTrustPeriodSetFixture,
  trustMinimizedProxyZeroTrustPeriodSetNextLogicBlockPassedFixture,
  zeroTrustPeriodSetFirstLogicSetFixture,
  zeroTrustPeriodSetFirstLogicSetNextLogicBlockPassedFixture,
} = require("./fixtures.js");

const ADMIN_SLOT =
  "0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103";
const LOGIC_SLOT =
  "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc";
const NEXT_LOGIC_SLOT =
  "0x19e3fabe07b65998b604369d85524946766191ac9434b39e27c424c976493685";
const NEXT_LOGIC_BLOCK_SLOT =
  "0xe3228ec3416340815a9ca41bfee1103c47feb764b4f0f4412f5d92df539fe0ee";
const PROPOSE_BLOCK_SLOT =
  "0x4b50776e56454fad8a52805daac1d9fd77ef59e4f1a053c342aaae5568af1388";
const ZERO_TRUST_PERIOD_SLOT =
  "0x7913203adedf5aca5386654362047f05edbd30729ae4b0351441c46289146720";

let owner = {};
let otherAccount = {};
let trustMinimizedProxy = {};

describe("TrustMinimizedProxy", () => {
  describe("AFTER DEPLOYMENT", () => {
    beforeEach("deploy fixture", async () => {
      const fixture = await deployTrustMinimizedProxyFixture();
      owner = fixture.owner;
      otherAccount = fixture.otherAccount;
      trustMinimizedProxy = fixture.trustMinimizedProxy;
    });
    it("Should confirm ADMIN_SLOT is valid", async () => {
      const adminSlot = ethers.BigNumber.from(
        ethers.utils.keccak256(ethers.utils.toUtf8Bytes("eip1967.proxy.admin"))
      )
        .sub(ethers.BigNumber.from(1))
        .toHexString();
      expect(adminSlot).to.equal(ADMIN_SLOT);
    });
    it("Should confirm LOGIC_SLOT is valid", async () => {
      const logicSlot = ethers.BigNumber.from(
        ethers.utils.keccak256(
          ethers.utils.toUtf8Bytes("eip1967.proxy.implementation")
        )
      )
        .sub(ethers.BigNumber.from(1))
        .toHexString();
      expect(logicSlot).to.equal(LOGIC_SLOT);
    });
    it("Should confirm NEXT_LOGIC_SLOT is valid", async () => {
      const nextLogicSlot = ethers.BigNumber.from(
        ethers.utils.keccak256(
          ethers.utils.toUtf8Bytes("eip3561.proxy.next.logic")
        )
      )
        .sub(ethers.BigNumber.from(1))
        .toHexString();
      expect(nextLogicSlot).to.equal(NEXT_LOGIC_SLOT);
    });
    it("Should confirm NEXT_LOGIC_BLOCK_SLOT is valid", async () => {
      const nextLogicBlockSlot = ethers.BigNumber.from(
        ethers.utils.keccak256(
          ethers.utils.toUtf8Bytes("eip3561.proxy.next.logic.block")
        )
      )
        .sub(ethers.BigNumber.from(1))
        .toHexString();
      expect(nextLogicBlockSlot).to.equal(NEXT_LOGIC_BLOCK_SLOT);
    });
    it("Should confirm PROPOSE_BLOCK_SLOT is valid", async () => {
      const proposeBlockSlot = ethers.BigNumber.from(
        ethers.utils.keccak256(
          ethers.utils.toUtf8Bytes("eip3561.proxy.propose.block")
        )
      )
        .sub(ethers.BigNumber.from(1))
        .toHexString();
      expect(proposeBlockSlot).to.equal(PROPOSE_BLOCK_SLOT);
    });
    it("Should confirm ZERO_TRUST_PERIOD_SLOT is valid", async () => {
      const zeroTrustPeriodSlot = ethers.BigNumber.from(
        ethers.utils.keccak256(
          ethers.utils.toUtf8Bytes("eip3561.proxy.zero.trust.period")
        )
      )
        .sub(ethers.BigNumber.from(1))
        .toHexString();
      expect(zeroTrustPeriodSlot).to.equal(ZERO_TRUST_PERIOD_SLOT);
    });
    it("Should set the right owner(msg.sender)", async () => {
      const adminAddress = ethers.utils.getAddress(
        ethers.utils.hexStripZeros(
          await ethers.provider.getStorageAt(
            trustMinimizedProxy.address,
            ADMIN_SLOT
          )
        )
      );
      expect(adminAddress).to.equal(owner.address);
    });
    it("Should have LOGIC_SLOT empty", async () => {
      const slotVal = await ethers.provider.getStorageAt(
        trustMinimizedProxy.address,
        LOGIC_SLOT
      );
      expect(slotVal).to.equal(ethers.constants.HashZero);
    });
    it("Should have NEXT_LOGIC_SLOT empty", async () => {
      const slotVal = await ethers.provider.getStorageAt(
        trustMinimizedProxy.address,
        NEXT_LOGIC_SLOT
      );
      expect(slotVal).to.equal(ethers.constants.HashZero);
    });
    it("Should have NEXT_LOGIC_BLOCK_SLOT empty", async () => {
      const slotVal = await ethers.provider.getStorageAt(
        trustMinimizedProxy.address,
        NEXT_LOGIC_BLOCK_SLOT
      );
      expect(slotVal).to.equal(ethers.constants.HashZero);
    });
    it("Should have PROPOSE_BLOCK_SLOT empty", async () => {
      const slotVal = await ethers.provider.getStorageAt(
        trustMinimizedProxy.address,
        PROPOSE_BLOCK_SLOT
      );
      expect(slotVal).to.equal(ethers.constants.HashZero);
    });
    it("Should have PROPOSE_BLOCK_SLOT empty", async () => {
      const slotVal = await ethers.provider.getStorageAt(
        trustMinimizedProxy.address,
        PROPOSE_BLOCK_SLOT
      );
      expect(slotVal).to.equal(ethers.constants.HashZero);
    });
    it("Should have ZERO_TRUST_PERIOD_SLOT empty", async () => {
      const slotVal = await ethers.provider.getStorageAt(
        trustMinimizedProxy.address,
        ZERO_TRUST_PERIOD_SLOT
      );
      expect(slotVal).to.equal(ethers.constants.HashZero);
    });

    describe("IfAdmin Interactions", () => {
      it(
        "changeAdmin(address newAdm): should change admin if called by admin",
        shouldChangeAdminIfAdmin
      );
      it(
        "changeAdmin(address newAdm): should fallback to proxy logic execution if called by not an admin",
        changeAdminshouldFallbackToLogicIfNotAdmin
      );
      it(
        "upgrade(bytes calldata data): should upgrade logic slot to next logic slot if called by admin",
        shouldUpgradeLogicSlotToNextLogicSlotIfAdmin
      );
      it(
        "upgrade(bytes calldata data): should fallback to proxy logic execution if called by not an admin",
        upgradeShouldFallbackToLogicIfNotAdmin
      );
      it(
        "cancelUpgrade(): should cancel upgrade to next logic slot if called by admin",
        shouldCancelUpgradeIfAdmin
      );
      it(
        "cancelUpgrade(): should fallback to proxy logic execution if called by not an admin",
        cancelUpgradeShouldFallbackToLogicIfNotAdmin
      );
      it(
        "prolongLock(uint b): should increase PROPOSE_BLOCK_SLOT value if called by admin",
        shouldIncreasePROPOSE_BLOCK_SLOTifAdmin
      );
      it(
        "prolongLock(uint b): should increase PROPOSE_BLOCK_SLOT value to max uint256 if called by admin",
        shouldIncreasePROPOSE_BLOCK_SLOTtoMaxUint256ifAdmin
      );
      it(
        "prolongLock(uint b): should fallback to proxy logic execution if called by not an admin",
        prolongLockShouldFallbackToLogicIfNotAdmin
      );
      it(
        "setZeroTrustPeriod(uint blocks): should change ZERO_TRUST_PERIOD_SLOT value if called by admin",
        shouldChangeZERO_TRUST_PERIOD_SLOTifAdmin
      );
      it(
        "setZeroTrustPeriod(uint blocks): should fail to change ZERO_TRUST_PERIOD_SLOT value to max uint256 if called by admin",
        shouldFailToChangeZERO_TRUST_PERIOD_SLOTtoMaxUint256ifAdmin
      );
      it(
        "setZeroTrustPeriod(uint blocks): should fallback to proxy logic execution if called by not an admin",
        setZeroTrustPeriodShouldFallbackToLogicIfNotAdmin
      );
      it(
        "proposeTo(address newLogic, bytes calldata data): should upgrade if called by admin",
        shouldUpgradeIfAdmin
      );
      it(
        "proposeTo(address newLogic, bytes calldata data): should fallback to proxy logic execution if called by not an admin",
        proposeToShouldFallbackToLogicIfNotAdmin
      );
    });
  });

  describe("AFTER FIRST LOGIC SET", () => {
    beforeEach("deploy fixture", async () => {
      const fixture = await trustMinimizedProxyFirstLogicSetFixture();
      owner = fixture.owner;
      otherAccount = fixture.otherAccount;
      trustMinimizedProxy = fixture.trustMinimizedProxy;
    });
    it(
      "changeAdmin(address newAdm): should change admin if called by admin",
      shouldChangeAdminIfAdmin
    );
    it(
      "changeAdmin(address newAdm): should fallback to proxy logic execution if called by not an admin",
      changeAdminshouldFallbackToLogicIfNotAdmin
    );
    it(
      "upgrade(bytes calldata data): should upgrade logic slot to next logic slot if called by admin",
      shouldUpgradeLogicSlotToNextLogicSlotIfAdmin
    );
    it(
      "upgrade(bytes calldata data): should fallback to proxy logic execution if called by not an admin",
      upgradeShouldFallbackToLogicIfNotAdmin
    );
    it(
      "cancelUpgrade(): should cancel upgrade to next logic slot if called by admin",
      shouldCancelUpgradeIfAdmin
    );
    it(
      "cancelUpgrade(): should fallback to proxy logic execution if called by not an admin",
      cancelUpgradeShouldFallbackToLogicIfNotAdmin
    );
    it(
      "prolongLock(uint b): should increase PROPOSE_BLOCK_SLOT value if called by admin",
      shouldIncreasePROPOSE_BLOCK_SLOTifAdmin
    );
    it(
      "prolongLock(uint b): should increase PROPOSE_BLOCK_SLOT value to max uint256 if called by admin",
      shouldIncreasePROPOSE_BLOCK_SLOTtoMaxUint256ifAdmin
    );
    it(
      "prolongLock(uint b): should fallback to proxy logic execution if called by not an admin",
      prolongLockShouldFallbackToLogicIfNotAdmin
    );
    it(
      "setZeroTrustPeriod(uint blocks): should change ZERO_TRUST_PERIOD_SLOT value if called by admin",
      shouldChangeZERO_TRUST_PERIOD_SLOTifAdmin
    );
    it(
      "setZeroTrustPeriod(uint blocks): should fail to change ZERO_TRUST_PERIOD_SLOT value to max uint256 if called by admin",
      shouldFailToChangeZERO_TRUST_PERIOD_SLOTtoMaxUint256ifAdmin
    );
    it(
      "setZeroTrustPeriod(uint blocks): should fallback to proxy logic execution if called by not an admin",
      setZeroTrustPeriodShouldFallbackToLogicIfNotAdmin
    );
    it(
      "proposeTo(address newLogic, bytes calldata data): should upgrade if called by admin",
      shouldUpgradeIfAdmin
    );
    it(
      "proposeTo(address newLogic, bytes calldata data): should fallback to proxy logic execution if called by not an admin",
      proposeToShouldFallbackToLogicIfNotAdmin
    );
  });

  describe("AFTER ZEROTRUSTPERIODSET", () => {
    describe("If nextLogicBlock wasn't reached yet", () => {
      beforeEach("deploy fixture", async () => {
        const fixture = await trustMinimizedProxyZeroTrustPeriodSetFixture();
        owner = fixture.owner;
        otherAccount = fixture.otherAccount;
        trustMinimizedProxy = fixture.trustMinimizedProxy;
      });
      it(
        "changeAdmin(address newAdm): should change admin if called by admin",
        shouldChangeAdminIfAdmin
      );
      it(
        "changeAdmin(address newAdm): should fallback to proxy logic execution if called by not an admin",
        changeAdminshouldFallbackToLogicIfNotAdmin
      );
      it("upgrade(bytes calldata data): should fail to upgrade logic slot to next logic slot if called by admin", async () => {
        await expect(trustMinimizedProxy.upgrade("0x")).to.be.reverted;
      });
      it(
        "upgrade(bytes calldata data): should fallback to proxy logic execution if called by not an admin",
        upgradeShouldFallbackToLogicIfNotAdmin
      );
      it(
        "cancelUpgrade(): should cancel upgrade to next logic slot if called by admin",
        shouldCancelUpgradeIfAdmin
      );
      it(
        "cancelUpgrade(): should fallback to proxy logic execution if called by not an admin",
        cancelUpgradeShouldFallbackToLogicIfNotAdmin
      );
      it(
        "prolongLock(uint b): should increase PROPOSE_BLOCK_SLOT value if called by admin",
        shouldIncreasePROPOSE_BLOCK_SLOTifAdmin
      );
      it("prolongLock(uint b): should fail to increase PROPOSE_BLOCK_SLOT value to max uint256 if called by admin", async () => {
        const arg = ethers.constants.MaxUint256;
        await expect(trustMinimizedProxy.prolongLock(arg)).to.be.reverted;
      });
      it(
        "prolongLock(uint b): should fallback to proxy logic execution if called by not an admin",
        prolongLockShouldFallbackToLogicIfNotAdmin
      );
      it(
        "setZeroTrustPeriod(uint blocks): should change ZERO_TRUST_PERIOD_SLOT value if called by admin and the value is higher than previous",
        shouldChangeZERO_TRUST_PERIOD_SLOTifAdminAndValueHigherThanPrevious
      );
      it(
        "setZeroTrustPeriod(uint blocks): should fail to change ZERO_TRUST_PERIOD_SLOT value to max uint256 if called by admin",
        shouldFailToChangeZERO_TRUST_PERIOD_SLOTtoMaxUint256ifAdmin
      );
      it(
        "setZeroTrustPeriod(uint blocks): should fail to change value if called by admin and the value is not higher than previous",
        shouldFailToChangeZERO_TRUST_PERIOD_SLOTifAdminAndValueNotHigherThanPrevious
      );
      it(
        "setZeroTrustPeriod(uint blocks): should fallback to proxy logic execution if called by not an admin",
        setZeroTrustPeriodShouldFallbackToLogicIfNotAdmin
      );
      it(
        "proposeTo(address newLogic, bytes calldata data): should fail to instantly upgrade if called by admin, sets next logic instead",
        shouldFailToInstantlyUpgradeIfAdminSetsNextLogicInstead
      );
      it(
        "proposeTo(address newLogic, bytes calldata data): should fallback to proxy logic execution if called by not an admin",
        proposeToShouldFallbackToLogicIfNotAdmin
      );
    });

    describe("If nextLogicBlock has passed", () => {
      beforeEach("deploy fixture", async () => {
        const fixture =
          await trustMinimizedProxyZeroTrustPeriodSetNextLogicBlockPassedFixture();
        owner = fixture.owner;
        otherAccount = fixture.otherAccount;
        trustMinimizedProxy = fixture.trustMinimizedProxy;
      });
      it(
        "changeAdmin(address newAdm): should change admin if called by admin",
        shouldChangeAdminIfAdmin
      );
      it(
        "changeAdmin(address newAdm): should fallback to proxy logic execution if called by not an admin",
        changeAdminshouldFallbackToLogicIfNotAdmin
      );
      it(
        "upgrade(bytes calldata data): should upgrade logic slot to next logic slot if called by admin",
        shouldUpgradeLogicSlotToNextLogicSlotIfAdmin
      );
      it(
        "upgrade(bytes calldata data): should fallback to proxy logic execution if called by not an admin",
        upgradeShouldFallbackToLogicIfNotAdmin
      );
      it(
        "cancelUpgrade(): should cancel upgrade to next logic slot if called by admin",
        shouldCancelUpgradeIfAdmin
      );
      it(
        "cancelUpgrade(): should fallback to proxy logic execution if called by not an admin",
        cancelUpgradeShouldFallbackToLogicIfNotAdmin
      );
      it(
        "prolongLock(uint b): should increase PROPOSE_BLOCK_SLOT value if called by admin",
        shouldIncreasePROPOSE_BLOCK_SLOTifAdmin
      );
      it("prolongLock(uint b): should fail to increase PROPOSE_BLOCK_SLOT value to max uint256 if called by admin", async () => {
        const arg = ethers.constants.MaxUint256;
        await expect(trustMinimizedProxy.prolongLock(arg)).to.be.reverted;
      });
      it(
        "prolongLock(uint b): should fallback to proxy logic execution if called by not an admin",
        prolongLockShouldFallbackToLogicIfNotAdmin
      );
      it("setZeroTrustPeriod(uint blocks): should change ZERO_TRUST_PERIOD_SLOT value if called by admin", async () => {
        const arg = 2;
        await expect(trustMinimizedProxy.setZeroTrustPeriod(arg)).to.emit(
          trustMinimizedProxy,
          "ZeroTrustPeriodSet"
        );
        const val = await ethers.provider.getStorageAt(
          trustMinimizedProxy.address,
          ZERO_TRUST_PERIOD_SLOT
        );
        expect(ethers.BigNumber.from(arg)).to.equal(val);
      });
      it(
        "setZeroTrustPeriod(uint blocks): should fail to change ZERO_TRUST_PERIOD_SLOT value to max uint256 if called by admin",
        shouldFailToChangeZERO_TRUST_PERIOD_SLOTtoMaxUint256ifAdmin
      );
      it(
        "setZeroTrustPeriod(uint blocks): should fail to change value if called by admin and the value is not higher than previous",
        shouldFailToChangeZERO_TRUST_PERIOD_SLOTifAdminAndValueNotHigherThanPrevious
      );
      it(
        "setZeroTrustPeriod(uint blocks): should fallback to proxy logic execution if called by not an admin",
        setZeroTrustPeriodShouldFallbackToLogicIfNotAdmin
      );
      it(
        "proposeTo(address newLogic, bytes calldata data): should set next logic if called by admin",
        shouldSetNextLogicIfAdmin
      );
      it(
        "proposeTo(address newLogic, bytes calldata data): should fallback to proxy logic execution if called by not an admin",
        proposeToShouldFallbackToLogicIfNotAdmin
      );
    });
  });

  describe("AFTER ZERO TRUST PERIOD SET AND FIRST LOGIC SET", () => {
    describe("If nextLogicBlock wasn't reached yet", () => {
      beforeEach("deploy fixture", async () => {
        const fixture = await zeroTrustPeriodSetFirstLogicSetFixture();
        owner = fixture.owner;
        otherAccount = fixture.otherAccount;
        trustMinimizedProxy = fixture.trustMinimizedProxy;
      });
      it(
        "changeAdmin(address newAdm): should change admin if called by admin",
        shouldChangeAdminIfAdmin
      );
      it(
        "changeAdmin(address newAdm): should fallback to proxy logic execution if called by not an admin",
        changeAdminshouldFallbackToLogicIfNotAdmin
      );
      it("upgrade(bytes calldata data): should fail to upgrade logic slot to next logic slot if called by admin", async () => {
        await expect(trustMinimizedProxy.upgrade("0x")).to.be.reverted;
      });
      it(
        "upgrade(bytes calldata data): should fallback to proxy logic execution if called by not an admin",
        upgradeShouldFallbackToLogicIfNotAdmin
      );
      it(
        "cancelUpgrade(): should cancel upgrade to next logic slot if called by admin",
        shouldCancelUpgradeIfAdmin
      );
      it(
        "cancelUpgrade(): should fallback to proxy logic execution if called by not an admin",
        cancelUpgradeShouldFallbackToLogicIfNotAdmin
      );
      it(
        "prolongLock(uint b): should increase PROPOSE_BLOCK_SLOT value if called by admin",
        shouldIncreasePROPOSE_BLOCK_SLOTifAdmin
      );
      it("prolongLock(uint b): should fail to increase PROPOSE_BLOCK_SLOT value to max uint256 if called by admin", async () => {
        const arg = ethers.constants.MaxUint256;
        await expect(trustMinimizedProxy.prolongLock(arg)).to.be.reverted;
      });
      it(
        "prolongLock(uint b): should fallback to proxy logic execution if called by not an admin",
        prolongLockShouldFallbackToLogicIfNotAdmin
      );
      it(
        "setZeroTrustPeriod(uint blocks): should change ZERO_TRUST_PERIOD_SLOT value if called by admin and the value is higher than previous",
        shouldChangeZERO_TRUST_PERIOD_SLOTifAdminAndValueHigherThanPrevious
      );
      it(
        "setZeroTrustPeriod(uint blocks): should fail to change ZERO_TRUST_PERIOD_SLOT value to max uint256 if called by admin",
        shouldFailToChangeZERO_TRUST_PERIOD_SLOTtoMaxUint256ifAdmin
      );
      it(
        "setZeroTrustPeriod(uint blocks): should fail to change value if called by admin and the value is not higher than previous",
        shouldFailToChangeZERO_TRUST_PERIOD_SLOTifAdminAndValueNotHigherThanPrevious
      );
      it(
        "setZeroTrustPeriod(uint blocks): should fallback to proxy logic execution if called by not an admin",
        setZeroTrustPeriodShouldFallbackToLogicIfNotAdmin
      );
      it(
        "proposeTo(address newLogic, bytes calldata data): should fail to instantly upgrade if called by admin, sets next logic instead",
        shouldFailToInstantlyUpgradeIfAdminSetsNextLogicInstead
      );
      it(
        "proposeTo(address newLogic, bytes calldata data): should fallback to proxy logic execution if called by not an admin",
        proposeToShouldFallbackToLogicIfNotAdmin
      );
    });

    describe("If nextLogicBlock has passed", () => {
      beforeEach("deploy fixture", async () => {
        const fixture =
          await zeroTrustPeriodSetFirstLogicSetNextLogicBlockPassedFixture();
        owner = fixture.owner;
        otherAccount = fixture.otherAccount;
        trustMinimizedProxy = fixture.trustMinimizedProxy;
      });
      it(
        "changeAdmin(address newAdm): should change admin if called by admin",
        shouldChangeAdminIfAdmin
      );
      it(
        "changeAdmin(address newAdm): should fallback to proxy logic execution if called by not an admin",
        changeAdminshouldFallbackToLogicIfNotAdmin
      );
      it(
        "upgrade(bytes calldata data): should upgrade logic slot to next logic slot if called by admin",
        shouldUpgradeLogicSlotToNextLogicSlotIfAdmin
      );
      it(
        "upgrade(bytes calldata data): should fallback to proxy logic execution if called by not an admin",
        upgradeShouldFallbackToLogicIfNotAdmin
      );
      it(
        "cancelUpgrade(): should cancel upgrade to next logic slot if called by admin",
        shouldCancelUpgradeIfAdmin
      );
      it(
        "cancelUpgrade(): should fallback to proxy logic execution if called by not an admin",
        cancelUpgradeShouldFallbackToLogicIfNotAdmin
      );
      it(
        "prolongLock(uint b): should increase PROPOSE_BLOCK_SLOT value if called by admin",
        shouldIncreasePROPOSE_BLOCK_SLOTifAdmin
      );
      it("prolongLock(uint b): should fail to increase PROPOSE_BLOCK_SLOT value to max uint256 if called by admin", async () => {
        const arg = ethers.constants.MaxUint256;
        await expect(trustMinimizedProxy.prolongLock(arg)).to.be.reverted;
      });
      it(
        "prolongLock(uint b): should fallback to proxy logic execution if called by not an admin",
        prolongLockShouldFallbackToLogicIfNotAdmin
      );
      it(
        "setZeroTrustPeriod(uint blocks): should change ZERO_TRUST_PERIOD_SLOT value if called by admin and the value is higher than previous",
        shouldChangeZERO_TRUST_PERIOD_SLOTifAdminAndValueHigherThanPrevious
      );
      it(
        "setZeroTrustPeriod(uint blocks): should fail to change ZERO_TRUST_PERIOD_SLOT value to max uint256 if called by admin",
        shouldFailToChangeZERO_TRUST_PERIOD_SLOTtoMaxUint256ifAdmin
      );
      it(
        "setZeroTrustPeriod(uint blocks): should fail to change value if called by admin and the value is not higher than previous",
        shouldFailToChangeZERO_TRUST_PERIOD_SLOTifAdminAndValueNotHigherThanPrevious
      );
      it(
        "setZeroTrustPeriod(uint blocks): should fallback to proxy logic execution if called by not an admin",
        setZeroTrustPeriodShouldFallbackToLogicIfNotAdmin
      );
      it(
        "proposeTo(address newLogic, bytes calldata data): should set next logic if called by admin",
        shouldSetNextLogicIfAdmin
      );
      it(
        "proposeTo(address newLogic, bytes calldata data): should fallback to proxy logic execution if called by not an admin",
        proposeToShouldFallbackToLogicIfNotAdmin
      );
    });
  });
});

async function shouldChangeAdminIfAdmin() {
  await expect(trustMinimizedProxy.changeAdmin(otherAccount.address))
    .to.emit(trustMinimizedProxy, "AdminChanged")
    .withArgs(owner.address, otherAccount.address);
  const adminAddress = ethers.utils.getAddress(
    ethers.utils.hexStripZeros(
      await ethers.provider.getStorageAt(
        trustMinimizedProxy.address,
        ADMIN_SLOT
      )
    )
  );
  expect(adminAddress).to.equal(otherAccount.address);
}

async function changeAdminshouldFallbackToLogicIfNotAdmin() {
  const tx = await trustMinimizedProxy
    .connect(otherAccount)
    ["changeAdmin"](otherAccount.address);
  await expect(tx).not.to.be.reverted.to.not.emit(
    trustMinimizedProxy,
    "AdminChanged"
  );
  const adminAddress = ethers.utils.getAddress(
    ethers.utils.hexStripZeros(
      await ethers.provider.getStorageAt(
        trustMinimizedProxy.address,
        ADMIN_SLOT
      )
    )
  );
  expect(adminAddress).not.to.equal(otherAccount.address);
}

async function shouldUpgradeLogicSlotToNextLogicSlotIfAdmin() {
  await expect(trustMinimizedProxy.upgrade("0x")).to.emit(
    trustMinimizedProxy,
    "Upgraded"
  );
  const logic = await ethers.provider.getStorageAt(
    trustMinimizedProxy.address,
    LOGIC_SLOT
  );
  const nextLogic = await ethers.provider.getStorageAt(
    trustMinimizedProxy.address,
    NEXT_LOGIC_SLOT
  );
  expect(logic).to.equal(nextLogic);
}

async function upgradeShouldFallbackToLogicIfNotAdmin() {
  const tx = await trustMinimizedProxy.connect(otherAccount).upgrade("0x");
  await expect(tx).not.to.be.reverted.to.not.emit(
    trustMinimizedProxy,
    "Upgraded"
  );
}

async function shouldCancelUpgradeIfAdmin() {
  await expect(trustMinimizedProxy.cancelUpgrade()).to.emit(
    trustMinimizedProxy,
    "NextLogicCanceled"
  );
  const logic = await ethers.provider.getStorageAt(
    trustMinimizedProxy.address,
    LOGIC_SLOT
  );
  const nextLogic = await ethers.provider.getStorageAt(
    trustMinimizedProxy.address,
    NEXT_LOGIC_SLOT
  );
  expect(logic).to.equal(nextLogic);
}

async function cancelUpgradeShouldFallbackToLogicIfNotAdmin() {
  const tx = await trustMinimizedProxy.connect(otherAccount).cancelUpgrade();
  await expect(tx).not.to.be.reverted.to.not.emit(
    trustMinimizedProxy,
    "NextLogicCanceled"
  );
}

async function shouldIncreasePROPOSE_BLOCK_SLOTifAdmin() {
  const proposeBlockInitial = await ethers.provider.getStorageAt(
    trustMinimizedProxy.address,
    PROPOSE_BLOCK_SLOT
  );
  const arg = 1;
  await expect(trustMinimizedProxy.prolongLock(arg)).to.emit(
    trustMinimizedProxy,
    "ProposingUpgradesRestrictedUntil"
  );
  const proposeBlock = await ethers.provider.getStorageAt(
    trustMinimizedProxy.address,
    PROPOSE_BLOCK_SLOT
  );
  expect(
    ethers.BigNumber.from(proposeBlockInitial).add(ethers.BigNumber.from(arg))
  ).to.equal(proposeBlock);
}

async function shouldIncreasePROPOSE_BLOCK_SLOTtoMaxUint256ifAdmin() {
  const proposeBlockInitial = await ethers.provider.getStorageAt(
    trustMinimizedProxy.address,
    PROPOSE_BLOCK_SLOT
  );
  const arg = ethers.constants.MaxUint256;
  await expect(trustMinimizedProxy.prolongLock(arg)).to.emit(
    trustMinimizedProxy,
    "ProposingUpgradesRestrictedUntil"
  );
  const proposeBlock = await ethers.provider.getStorageAt(
    trustMinimizedProxy.address,
    PROPOSE_BLOCK_SLOT
  );
  expect(
    ethers.BigNumber.from(proposeBlockInitial).add(ethers.BigNumber.from(arg))
  ).to.equal(proposeBlock);
}

async function prolongLockShouldFallbackToLogicIfNotAdmin() {
  const proposeBlockInitial = await ethers.provider.getStorageAt(
    trustMinimizedProxy.address,
    PROPOSE_BLOCK_SLOT
  );
  const arg = 1;
  const tx = await trustMinimizedProxy.connect(otherAccount).prolongLock(arg);
  await expect(tx).not.to.be.reverted.to.not.emit(
    trustMinimizedProxy,
    "ProposingUpgradesRestrictedUntil"
  );
  const proposeBlock = await ethers.provider.getStorageAt(
    trustMinimizedProxy.address,
    PROPOSE_BLOCK_SLOT
  );
  expect(proposeBlockInitial).to.equal(proposeBlock);
}

async function shouldChangeZERO_TRUST_PERIOD_SLOTifAdmin() {
  const valInitial = await ethers.provider.getStorageAt(
    trustMinimizedProxy.address,
    ZERO_TRUST_PERIOD_SLOT
  );
  const arg = 1;
  await expect(trustMinimizedProxy.setZeroTrustPeriod(arg)).to.emit(
    trustMinimizedProxy,
    "ZeroTrustPeriodSet"
  );
  const val = await ethers.provider.getStorageAt(
    trustMinimizedProxy.address,
    ZERO_TRUST_PERIOD_SLOT
  );
  expect(
    ethers.BigNumber.from(valInitial).add(ethers.BigNumber.from(arg))
  ).to.equal(val);
}

async function shouldFailToChangeZERO_TRUST_PERIOD_SLOTtoMaxUint256ifAdmin() {
  const valInitial = await ethers.provider.getStorageAt(
    trustMinimizedProxy.address,
    ZERO_TRUST_PERIOD_SLOT
  );
  const arg = ethers.constants.MaxUint256;
  await expect(trustMinimizedProxy.setZeroTrustPeriod(arg)).to.be.reverted;
  const val = await ethers.provider.getStorageAt(
    trustMinimizedProxy.address,
    ZERO_TRUST_PERIOD_SLOT
  );
  expect(valInitial).to.equal(val);
}

async function setZeroTrustPeriodShouldFallbackToLogicIfNotAdmin() {
  const valInitial = await ethers.provider.getStorageAt(
    trustMinimizedProxy.address,
    ZERO_TRUST_PERIOD_SLOT
  );
  const arg = 1;
  const tx = await trustMinimizedProxy
    .connect(otherAccount)
    .setZeroTrustPeriod(arg);
  await expect(tx).not.to.be.reverted.to.not.emit(
    trustMinimizedProxy,
    "ZeroTrustPeriodSet"
  );
  const val = await ethers.provider.getStorageAt(
    trustMinimizedProxy.address,
    ZERO_TRUST_PERIOD_SLOT
  );
  expect(valInitial).to.equal(val);
}

async function shouldUpgradeIfAdmin() {
  await expect(trustMinimizedProxy.proposeTo(otherAccount.address, "0x"))
    .to.emit(trustMinimizedProxy, "Upgraded")
    .withArgs(otherAccount.address);
  const logic = ethers.utils.getAddress(
    ethers.utils.hexStripZeros(
      await ethers.provider.getStorageAt(
        trustMinimizedProxy.address,
        LOGIC_SLOT
      )
    )
  );
  expect(logic).to.equal(otherAccount.address);
}

async function proposeToShouldFallbackToLogicIfNotAdmin() {
  const logicInit = await ethers.provider.getStorageAt(
    trustMinimizedProxy.address,
    LOGIC_SLOT
  );
  const tx = await trustMinimizedProxy
    .connect(otherAccount)
    .proposeTo(owner.address, "0x");
  await expect(tx).not.to.be.reverted.to.not.emit(
    trustMinimizedProxy,
    "Upgraded"
  );
  const logic = await ethers.provider.getStorageAt(
    trustMinimizedProxy.address,
    LOGIC_SLOT
  );
  expect(logic).to.equal(logicInit);
}

async function shouldChangeZERO_TRUST_PERIOD_SLOTifAdminAndValueHigherThanPrevious() {
  const arg = 3;
  await expect(trustMinimizedProxy.setZeroTrustPeriod(arg)).to.emit(
    trustMinimizedProxy,
    "ZeroTrustPeriodSet"
  );
  const val = await ethers.provider.getStorageAt(
    trustMinimizedProxy.address,
    ZERO_TRUST_PERIOD_SLOT
  );
  expect(arg).to.equal(parseInt(ethers.utils.hexStripZeros(val)));
}

async function shouldFailToChangeZERO_TRUST_PERIOD_SLOTifAdminAndValueNotHigherThanPrevious() {
  const valInitial = await ethers.provider.getStorageAt(
    trustMinimizedProxy.address,
    ZERO_TRUST_PERIOD_SLOT
  );
  const arg = 1;
  await expect(trustMinimizedProxy.setZeroTrustPeriod(arg)).to.be.reverted;
  const val = await ethers.provider.getStorageAt(
    trustMinimizedProxy.address,
    ZERO_TRUST_PERIOD_SLOT
  );
  expect(valInitial).to.equal(val);
}

async function shouldFailToInstantlyUpgradeIfAdminSetsNextLogicInstead() {
  const logicInitial = await ethers.provider.getStorageAt(
    trustMinimizedProxy.address,
    LOGIC_SLOT
  );
  const nextLogicInitial = await ethers.provider.getStorageAt(
    trustMinimizedProxy.address,
    NEXT_LOGIC_SLOT
  );
  await expect(
    trustMinimizedProxy.proposeTo(otherAccount.address, "0x")
  ).to.emit(trustMinimizedProxy, "NextLogicDefined");
  const logic = await ethers.provider.getStorageAt(
    trustMinimizedProxy.address,
    LOGIC_SLOT
  );
  const nextLogic = await ethers.provider.getStorageAt(
    trustMinimizedProxy.address,
    NEXT_LOGIC_SLOT
  );
  expect(logic).to.equal(logicInitial);
  expect(nextLogic).to.not.equal(nextLogicInitial);
}

async function shouldSetNextLogicIfAdmin() {
  await expect(
    trustMinimizedProxy.proposeTo(otherAccount.address, "0x")
  ).to.emit(trustMinimizedProxy, "NextLogicDefined");
  const logic = ethers.utils.getAddress(
    ethers.utils.hexStripZeros(
      await ethers.provider.getStorageAt(
        trustMinimizedProxy.address,
        NEXT_LOGIC_SLOT
      )
    )
  );
  expect(logic).to.equal(otherAccount.address);
}
