const { ethers } = require("hardhat");
const toBN = require('web3-utils').toBN;

module.exports = async ({getNamedAccounts, deployments, network}) => {
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();
    const owner = deployer;
    const oracle = await deploy('DummyOracle', {
        from: deployer, 
        args:[1],
        log:true
    })

    await deploy('StablePriceOracle', {
        from: deployer, 
        args:[oracle.address,[16478144, 16478144, 16478144, 9569999, 9569999, 9569999, 3866026, 47533]],
        log:true
    })

}

module.exports.tags = ['oracles'];
module.exports.dependencies = ['registry']