const fs = require("fs");
const { config, ethers, tenderly, run } = require("hardhat");

const delayMS = 3000;

const main = async () => {

    const NEAFactory = await ethers.getContractAt(
        'NEAFactory', 
        fs.readFileSync("./artifacts/NEAFactory.address").toString());

    /*const NEA1 = await NEAFactory.deployNEA(
        'testname',
        'test',
        {gasLimit:2000000}
    );

    await sleep(delayMS);

    console.log(NEA1) 
    */
    NEA1_address = "0x7263562ca1d02ab95652fb9dba243e2ecf1cebdd" //await NEAFactory.getIdentity(NEA1.from)
    
    const NEA1_contract = await ethers.getContractAt(
        'NEA', 
        NEA1_address);

    const NEA1_support = await NEA1_contract.supportNEA(
        {value: ethers.utils.parseEther("0.1"), gasLimit:2000000}
    )

    console.log(NEA1_support) 
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });