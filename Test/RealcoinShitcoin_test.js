const RealcoinShitcoin = artifacts.require("RealcoinShitcoin");
const truffleAssert = require('truffle-assertions');



contract("RealcoinShitcoin", accounts => {

  var instance;
  before(async function(){
    instance = await RealcoinShitcoin.deployed({value: web3.utils.toWei("0.1", "ether"), from:accounts[0]});
  });

  it("should initialize with correct balance", async function(){
    assert(await instance.balance() == web3.utils.toWei("0.1", "ether"), "Balance " + await instance.balance()
    + " not equal to constructor deposit of " + web3.utils.toWei("0.1", "ether"));
  });

  it("should have same internal balance as contract balance", async function(){
    assert(await instance.balance() == await web3.eth.getBalance(instance.address), "Balance " + await instance.balance()
    + " not equal to contract balance of " + await web3.eth.getBalance(instance.address));
  });

  it("should require bet to be <= contract balance", async function(){
    var id = Math.random().toString(36);
    truffleAssert.reverts(instance.placeBet(id, 0, {value:web3.utils.toWei("1.1", "ether")}));
  });

/* Following test doesnt work. Need to calculate real cost of transaction  see: https://ethereum.stackexchange.com/questions/42950/how-to-get-the-transaction-cost-in-a-truffle-unit-test
  it("should pay and adjust balance if user wins or just adjust balance if user loses", async function(){
    var priorBalance = await web3.eth.getBalance(accounts[0]);
    var amount = await instance.placeBet("Realcoin", {value:web3.utils.toWei("0.1", "ether")})
    if(amount > 0)
    {
      assert(priorBalance + web3.utils.toWei("0.1", "ether") - await instance.placeBet.estimateGas("Realcoin", {value:web3.utils.toWei("0.1", "ether")}) == await web3.eth.getBalance(accounts[0]),
            "priorBalance:" + priorBalance + " + bet:" + web3.utils.toWei("0.1", "ether") + " - estimateGas:"
            + await instance.placeBet.estimateGas("Realcoin", {value:web3.utils.toWei("0.1", "ether")}) + " must equal actual balance:" + await web3.eth.getBalance(accounts[0]));
    }
    else {
      assert(priorBalance - web3.utils.toWei("0.1", "ether") - await instance.placeBet.estimateGas("Realcoin", {value:web3.utils.toWei("0.1", "ether")}) == await web3.eth.getBalance(accounts[0]),
            "priorBalance:" + priorBalance + " - bet:" + web3.utils.toWei("0.1", "ether") + " - estimateGas:"
            +  await instance.placeBet.estimateGas("Realcoin", {value:web3.utils.toWei("0.1", "ether")}) + " must equal actual balance:" + await web3.eth.getBalance(accounts[0]));
    }
    assert(amount )
  });
*/

});
