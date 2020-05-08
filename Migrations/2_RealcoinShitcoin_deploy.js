const RealcoinShitcoin = artifacts.require("RealcoinShitcoin");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(RealcoinShitcoin);
};
