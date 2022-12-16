const MockTokenABI = require('../artifacts/contracts/MockToken.sol/MockToken.json')
const { time } = require('@nomicfoundation/hardhat-network-helpers')

async function deployTrustMinimizedProxyFixture() {
  const [owner, otherAccount, acc2] = await ethers.getSigners()
  const TrustMinimizedProxy = await ethers.getContractFactory('TrustMinimizedProxy')
  const trustMinimizedProxy = await TrustMinimizedProxy.deploy()
  const MockLogic = await ethers.getContractFactory('MockToken')
  const mockLogic = await MockLogic.deploy()
  return { trustMinimizedProxy, owner, otherAccount, mockLogic, acc2 }
}

async function trustMinimizedProxyFirstLogicSetFixture() {
  const res = await deployTrustMinimizedProxyFixture()
  const owner = res.owner,
    otherAccount = res.otherAccount,
    acc2 = res.acc2,
    trustMinimizedProxy = res.trustMinimizedProxy,
    mockLogic = res.mockLogic
  const iMockToken = new ethers.utils.Interface(MockTokenABI.abi)
  const init = iMockToken.encodeFunctionData('init', [acc2.address])
  await trustMinimizedProxy.proposeTo(mockLogic.address, init)
  return { trustMinimizedProxy, owner, otherAccount, mockLogic, acc2 }
}

async function trustMinimizedProxyZeroTrustPeriodSetFixture() {
  const res = await deployTrustMinimizedProxyFixture()
  const owner = res.owner,
    otherAccount = res.otherAccount,
    acc2 = res.acc2,
    trustMinimizedProxy = res.trustMinimizedProxy,
    mockLogic = res.mockLogic
  await trustMinimizedProxy.setZeroTrustPeriod(2)
  return { trustMinimizedProxy, owner, otherAccount, mockLogic }
}

async function trustMinimizedProxyZeroTrustPeriodSetNextLogicBlockPassedFixture() {
  const res = await deployTrustMinimizedProxyFixture()
  const owner = res.owner,
    otherAccount = res.otherAccount,
    acc2 = res.acc2,
    trustMinimizedProxy = res.trustMinimizedProxy,
    mockLogic = res.mockLogic
  await trustMinimizedProxy.setZeroTrustPeriod(1)
  const ONE_DAY = 60 * 60 * 24
  const passedTime = (await time.latest()) + ONE_DAY
  await time.increaseTo(passedTime)
  return { trustMinimizedProxy, owner, otherAccount, mockLogic, passedTime }
}

async function zeroTrustPeriodSetFirstLogicSetFixture() {
  const res = await trustMinimizedProxyFirstLogicSetFixture()
  const owner = res.owner,
    otherAccount = res.otherAccount,
    acc2 = res.acc2,
    trustMinimizedProxy = res.trustMinimizedProxy,
    mockLogic = res.mockLogic
  await trustMinimizedProxy.setZeroTrustPeriod(2)
  return { trustMinimizedProxy, owner, otherAccount, mockLogic, acc2 }
}

async function zeroTrustPeriodSetFirstLogicSetNextLogicBlockPassedFixture() {
  const res = await zeroTrustPeriodSetFirstLogicSetFixture()
  const owner = res.owner,
    otherAccount = res.otherAccount,
    acc2 = res.acc2,
    trustMinimizedProxy = res.trustMinimizedProxy,
    mockLogic = res.mockLogic
  const ONE_DAY = 60 * 60 * 24
  const passedTime = (await time.latest()) + ONE_DAY
  await time.increaseTo(passedTime)
  return { trustMinimizedProxy, owner, otherAccount, mockLogic, acc2, passedTime }
}

module.exports = {
  deployTrustMinimizedProxyFixture,
  trustMinimizedProxyFirstLogicSetFixture,
  trustMinimizedProxyZeroTrustPeriodSetFixture,
  trustMinimizedProxyZeroTrustPeriodSetNextLogicBlockPassedFixture,
  zeroTrustPeriodSetFirstLogicSetFixture,
  zeroTrustPeriodSetFirstLogicSetNextLogicBlockPassedFixture,
}
