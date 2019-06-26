const Main = artifacts.require("./Main.sol");
const User = artifacts.require("./User.sol");

module.exports = deployer => {
  deployer.deploy(Main)
  deployer.deploy(User)
}