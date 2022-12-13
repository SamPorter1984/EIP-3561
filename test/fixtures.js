const MockTokenABI = require("../artifacts/contracts/MockToken.sol/MockToken.json");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

async function deployTrustMinimizedProxyFixture() {
  const [owner, otherAccount] = await ethers.getSigners();
  const TrustMinimizedProxy = await ethers.getContractFactory(
    "TrustMinimizedProxy"
  );
  const trustMinimizedProxy = await TrustMinimizedProxy.deploy();
  return { trustMinimizedProxy, owner, otherAccount };
}

async function trustMinimizedProxyFirstLogicSetFixture() {
  const [owner, otherAccount, acc2, acc3, acc4, acc5] =
    await ethers.getSigners();
  const MockLogic = await ethers.getContractFactory("MockToken");
  const mockLogic = await MockLogic.deploy();
  const TrustMinimizedProxy = await ethers.getContractFactory(
    "TrustMinimizedProxy"
  );
  const trustMinimizedProxy = await TrustMinimizedProxy.deploy();
  const iMockToken = new ethers.utils.Interface(MockTokenABI.abi);
  const init = iMockToken.encodeFunctionData("init", [
    acc2.address,
    acc3.address,
    acc4.address,
    acc5.address,
  ]);
  await trustMinimizedProxy.proposeTo(mockLogic.address, init);
  return { trustMinimizedProxy, owner, otherAccount, mockLogic };
}

async function trustMinimizedProxyZeroTrustPeriodSetFixture() {
  const [owner, otherAccount] = await ethers.getSigners();
  const TrustMinimizedProxy = await ethers.getContractFactory(
    "TrustMinimizedProxy"
  );
  const trustMinimizedProxy = await TrustMinimizedProxy.deploy();
  await trustMinimizedProxy.setZeroTrustPeriod(2);
  return { trustMinimizedProxy, owner, otherAccount };
}

async function trustMinimizedProxyZeroTrustPeriodSetNextLogicBlockPassedFixture() {
  const [owner, otherAccount] = await ethers.getSigners();
  const TrustMinimizedProxy = await ethers.getContractFactory(
    "TrustMinimizedProxy"
  );
  const trustMinimizedProxy = await TrustMinimizedProxy.deploy();
  await trustMinimizedProxy.setZeroTrustPeriod(1);
  const ONE_DAY = 60 * 60 * 24;
  const passedTime = (await time.latest()) + ONE_DAY;
  await time.increaseTo(passedTime);
  return { trustMinimizedProxy, owner, otherAccount, passedTime };
}

async function zeroTrustPeriodSetFirstLogicSetFixture() {
  const [owner, otherAccount, acc2, acc3, acc4, acc5] =
    await ethers.getSigners();
  const MockLogic = await ethers.getContractFactory("MockToken");
  const mockLogic = await MockLogic.deploy();
  const TrustMinimizedProxy = await ethers.getContractFactory(
    "TrustMinimizedProxy"
  );
  const trustMinimizedProxy = await TrustMinimizedProxy.deploy();
  const iMockToken = new ethers.utils.Interface(MockTokenABI.abi);
  const init = iMockToken.encodeFunctionData("init", [
    acc2.address,
    acc3.address,
    acc4.address,
    acc5.address,
  ]);
  await trustMinimizedProxy.proposeTo(mockLogic.address, init);
  await trustMinimizedProxy.setZeroTrustPeriod(2);
  return { trustMinimizedProxy, owner, otherAccount, mockLogic };
}

async function zeroTrustPeriodSetFirstLogicSetNextLogicBlockPassedFixture() {
  const [owner, otherAccount, acc2, acc3, acc4, acc5] =
    await ethers.getSigners();
  const MockLogic = await ethers.getContractFactory("MockToken");
  const mockLogic = await MockLogic.deploy();
  const TrustMinimizedProxy = await ethers.getContractFactory(
    "TrustMinimizedProxy"
  );
  const trustMinimizedProxy = await TrustMinimizedProxy.deploy();
  const iMockToken = new ethers.utils.Interface(MockTokenABI.abi);
  const init = iMockToken.encodeFunctionData("init", [
    acc2.address,
    acc3.address,
    acc4.address,
    acc5.address,
  ]);
  await trustMinimizedProxy.proposeTo(mockLogic.address, init);
  await trustMinimizedProxy.setZeroTrustPeriod(2);
  const ONE_DAY = 60 * 60 * 24;
  const passedTime = (await time.latest()) + ONE_DAY;
  await time.increaseTo(passedTime);
  return { trustMinimizedProxy, owner, otherAccount, mockLogic, passedTime };
}

module.exports = {
  deployTrustMinimizedProxyFixture,
  trustMinimizedProxyFirstLogicSetFixture,
  trustMinimizedProxyZeroTrustPeriodSetFixture,
  trustMinimizedProxyZeroTrustPeriodSetNextLogicBlockPassedFixture,
  zeroTrustPeriodSetFirstLogicSetFixture,
  zeroTrustPeriodSetFirstLogicSetNextLogicBlockPassedFixture,
};
