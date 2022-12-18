const MockTokenABI = require('../artifacts/contracts/MockLogic.sol/MockLogic.json')
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers')

async function deployTrustMinimizedProxyFixture() {
  const [owner, otherAccount, acc2] = await ethers.getSigners()
  const TrustMinimizedProxy = await ethers.getContractFactory('TrustMinimizedProxy')
  const trustMinimizedProxy = await TrustMinimizedProxy.deploy()
  const MockLogic = await ethers.getContractFactory('MockLogic')
  const mockLogic = await MockLogic.deploy()
  return { trustMinimizedProxy, owner, otherAccount, mockLogic, acc2 }
}

async function trustMinimizedProxyWithMockLogicFixture() {
  const res = await deployTrustMinimizedProxyFixture()
  const owner = res.owner,
    otherAccount = res.otherAccount,
    acc2 = res.acc2,
    trustMinimizedProxy = res.trustMinimizedProxy,
    mockLogic = res.mockLogic
  const iMockToken = new ethers.utils.Interface(MockTokenABI.abi)
  const init = iMockToken.encodeFunctionData('init', [otherAccount.address])
  await trustMinimizedProxy.proposeTo(mockLogic.address, init)
  const trustMinimizedProxyWithLogic = await mockLogic.attach(trustMinimizedProxy.address)
  return { trustMinimizedProxyWithLogic, owner, otherAccount, mockLogic, acc2 }
}

module.exports = {
  deployTrustMinimizedProxyFixture,
  trustMinimizedProxyWithMockLogicFixture,
}
