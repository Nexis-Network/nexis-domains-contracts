const { ethers } = require("hardhat");
const ZERO_HASH = "0x0000000000000000000000000000000000000000000000000000000000000000";
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

const namehash = require('eth-ens-namehash');
const sha3 = require('web3-utils').sha3;

module.exports = async ({getNamedAccounts, deployments, network}) => {
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();
    const owner = deployer;
    const ens = await ethers.getContract('ENSRegistry')

    await deploy('BaseRegistrarImplementation', {
        from: deployer, 
        args: [ens.address, namehash.hash('nzt')],
        log: true,
        gasPrice: 5000000000,
        gasLimit: 2_000_000,
    })

    const base = await ethers.getContract('BaseRegistrarImplementation');

    const ownedResolver = await ethers.getContract('OwnedResolver')


    const transactions = []
    await base.addController(deployer, {from: deployer})
    console.log("base.address: ", base.address)

    await ens.setSubnodeOwner(ZERO_HASH, sha3('nzt'), base.address, )
    await ens.setSubnodeRecord(ZERO_HASH, sha3('nzt'), base.address, ownedResolver.address, 0, )
    await base.register(sha3('resolver'), deployer, 31536000, {from: deployer, })
    console.log(`Waiting on ${transactions.length} transactions setting base registrar`);
    // await Promise.all(transactions.map((tx) => tx.wait()));
}


module.exports.tags = ['baseregistrar'];
module.exports.dependencies = ['registry', 'owned-resolver']