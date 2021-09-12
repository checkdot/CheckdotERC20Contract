const CheckDot = artifacts.require("CheckDot");

module.exports = function(deployer) {
  deployer.deploy(CheckDot, "0x961a14bEaBd590229B1c68A21d7068c8233C8542");
};
