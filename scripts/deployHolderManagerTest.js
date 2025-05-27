const { ethers, upgrades} = require("hardhat");

const formatBigNumberToUnits = (number) => {
  return ethers.formatUnits(number, 18);
}

const formatUnitsToBigNumber = (number) => {
  return ethers.parseUnits(number.toString(), 18);
}


const main = async () => {
  const [owner, receiver, receiver2, receiver3, receiver4, receiver5] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", owner.address);

  const Main = await ethers.getContractFactory("TestToken");
  const main = await upgrades.deployProxy(Main, [owner.address.toString()], { initializer: 'initialize', kind: 'uups' });
  await main.waitForDeployment();

  const totalSupply = formatBigNumberToUnits(await main.totalSupply(), 18);

  console.log(`
  [SETUP]
    Main contract address is ${(await main.getAddress())}
    Owner is ${await main.owner()}
    Total Supply is ${totalSupply}
    Balance of owner is ${formatBigNumberToUnits(await main.balanceOf(owner.address))}
    Prize pool budget is ${formatBigNumberToUnits(await main.getPrizePool())}
  `); 

  await main.connect(owner).transfer(receiver.address, formatUnitsToBigNumber("1000"));
  await main.connect(owner).transfer(receiver2.address, formatUnitsToBigNumber("1000"));
  await main.connect(owner).transfer(receiver3.address, formatUnitsToBigNumber("1000"));
  await main.connect(owner).transfer(receiver4.address, formatUnitsToBigNumber("1000"));
  await main.connect(owner).transfer(receiver5.address, formatUnitsToBigNumber("1000"));

  
  let holderAmount = await main.getHolderAmount();
  console.log(`Holder amount is ${holderAmount}`);

  const {address, index, creationDate} = await main.getHolderByAddress(owner.address)
  console.log(` Index of receiver is ${index} | Address is ${address} | Created at ${creationDate}`)

  for(let i = 0; i <= holderAmount;  i++){

  }

  console.log(`
  [HOLDER LIST]

  `)
 
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
