const Migrations = artifacts.require("Migrations");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
};

//need to send some eth to this contract so that it can pay up if users win...
//but then I need a way to withdraw the funds... this means implementing ownable contract
//also need to make sure the contract holds at least 2x the betAmount otherwise refund the player.
