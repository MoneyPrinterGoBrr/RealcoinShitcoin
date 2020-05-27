const RealcoinShitcoin = artifacts.require("RealcoinShitcoin");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(RealcoinShitcoin, {value:web3.utils.toWei("0.1", "ether")});
};
