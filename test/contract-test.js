const truffleAssert = require('truffle-assertions');
const contractTruffle = require('truffle-contract');
const { toWei, toBN } = web3.utils;

/* CheckDotToken Provider */
const checkdotTokenArtifact = require('../build/contracts/CheckDot.json');
const CheckdotTokenContract = contractTruffle(checkdotTokenArtifact);
CheckdotTokenContract.setProvider(web3.currentProvider);

contract('CheckdotTokenContract', async (accounts) => {
  let tokenInstance;

  let owner;
  let user;

  before(async () => {
    // instances
    tokenInstance = await CheckdotTokenContract.deployed();

    // accounts
    owner = accounts[0];
    user = accounts[1];
  });

  it('balance of user should have CDT amount', async () => {
    // store user initial CDT balance
    const userInitialBalance = await tokenInstance.balanceOf(user);

    // console.log("owner Balance", (await tokenInstance.balanceOf(owner)).toString());
    // console.log("user  Balance", userInitialBalance.toString());
    
    // initial CDT transfert
    const transferAmount = toWei('2', 'ether');
    await truffleAssert.passes(tokenInstance.transfer(user, transferAmount, { from: owner }), 'initial transfer failed');

    // compare initiator current CDT balance with initial balance
    const userCurrentBalance = await tokenInstance.balanceOf(user);
    assert.equal(
      userCurrentBalance.toString(),
      userInitialBalance.add(toBN(transferAmount)).toString(),
      'should have 2 CDT'
    );

    // resend to owner the CDT tokens
    await truffleAssert.passes(tokenInstance.transfer(owner, transferAmount, { from: user }), 'initial transfer failed');

    // compare initiator current CDT balance with initial balance
    const userEndBalance = await tokenInstance.balanceOf(user);
    assert.equal(
      userEndBalance.toString(),
      userInitialBalance.toString(),
      'should not have CDT'
    );
  });

  it('should burn 0.5 CDT amount', async () => {
    // store user initial CDT balance
    const userInitialBalance = await tokenInstance.balanceOf(user);
    
    // initial CDT transfert
    const transferAmount = toWei('0.5', 'ether');
    await truffleAssert.passes(tokenInstance.transfer(user, transferAmount, { from: owner }), 'initial transfer failed');

    // compare initiator current CDT balance with initial balance
    const userCurrentBalance = await tokenInstance.balanceOf(user);
    assert.equal(
      userCurrentBalance.toString(),
      userInitialBalance.add(toBN(transferAmount)).toString(),
      'should have 0.5 CDT'
    );

    // burn the 0.5 CDT tokens
    await truffleAssert.passes(tokenInstance.burn(transferAmount, { from: user }), 'burn transfer failed');

    // compare initiator current CDT balance with initial balance
    const userEndBalance = await tokenInstance.balanceOf(user);
    assert.equal(
      userEndBalance.toString(),
      userInitialBalance.toString(),
      'should not have CDT'
    );
  });
  
});