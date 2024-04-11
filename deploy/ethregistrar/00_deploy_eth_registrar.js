const { ethers } = require("hardhat");
const ZERO_HASH = "0x0000000000000000000000000000000000000000000000000000000000000000"
const namehash = require('eth-ens-namehash');
const sha3 = require('web3-utils').sha3;
module.exports = async ({getNamedAccounts, deployments, network}) => {
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();
    const owner = deployer;
    const baseRegistrar = await ethers.getContract('BaseRegistrarImplementation');

    const priceOracle = await ethers.getContract('StablePriceOracle')

    await deploy('ETHRegistrarController', {
        from: deployer, 
        args: [baseRegistrar.address, priceOracle.address, 120, 86400],
        log: true
    })  

    const controller = await ethers.getContract('ETHRegistrarController')
    const ens = await ethers.getContract('ENSRegistry')
    const owned = await ethers.getContract('OwnedResolver')
    const transactions = []
    await new Promise(r => setTimeout(r, 2000));
    await baseRegistrar.addController(controller.address, {from: deployer})
    // ESTIMATE GAS -->
    await controller.setPriceOracle(priceOracle.address, {from: deployer})
    await owned.setInterface(namehash.hash('nzt'), "0x018fac06", controller.address)
    console.log(`Waiting on settings to take place ${transactions.length}`)
    // await Promise.all(transactions.map((tx) => tx.wait()));
}

module.exports.tags = ['eth-registrar'];
module.exports.dependencies = ['registry', 'oracles']