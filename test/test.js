const {time, loadFixture} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
// const { ethers } = require("ethers");

// Utility functions for handling BigNumber conversions
const formatBigNumberToUnits = (number) => {
  return ethers.formatUnits(number, 18);
}

const formatUnitsToBigNumber = (number) => {
  return ethers.parseUnits(number.toString(), 18);
}

// Main test suite for testing upgradeable contracts
describe("Testing Upgradeable Contracts", () => {
    let isFirst = true;
    let owner, receiver, receiver2, receiver3, receiver4, receiver5;
    let testTokenV1, testTokenV2;

    // Setup before each test
    beforeEach(async () => {
        // Get test accounts
        [owner, receiver, receiver2, receiver3, receiver4, receiver5] = await ethers.getSigners();

        // Deploy V1 contract
        const TestTokenV1 = await ethers.getContractFactory("TestToken");
        testTokenV1 = await upgrades.deployProxy(TestTokenV1, [owner.address.toString()], { initializer: 'initialize', kind: 'uups' });
        await testTokenV1.waitForDeployment();
        const totalSupply = formatBigNumberToUnits(await testTokenV1.totalSupply(), 18);

        // Log initial setup details only once
        if(isFirst){
            console.log(`        [SETUP]
        Owner is ${await testTokenV1.owner()}
        Total Supply is ${totalSupply}
        Balance of owner is ${formatBigNumberToUnits(await testTokenV1.balanceOf(owner.address))}
        Prize pool budget is ${formatBigNumberToUnits(await testTokenV1.getPrizePool())}`); 
        }
        
        isFirst = false;
    })

    // Test suite for V1 contract functionality
    describe("TestToken V1", () => {
        // Test basic token transfers
        it("Transfer Test", async () => {
            await testTokenV1.connect(owner).transfer(receiver.address, formatUnitsToBigNumber("1000.53"));
            await testTokenV1.connect(owner).transfer(receiver2.address, formatUnitsToBigNumber("1000"));
            await testTokenV1.connect(owner).transfer(receiver3.address, formatUnitsToBigNumber("1000"));
            await testTokenV1.connect(owner).transfer(receiver4.address, formatUnitsToBigNumber("1000"));
            await testTokenV1.connect(owner).transfer(receiver5.address, formatUnitsToBigNumber("1000"));
    
            expect(formatBigNumberToUnits(await testTokenV1.balanceOf(owner))).to.equal("4999.47");
            expect(formatBigNumberToUnits(await testTokenV1.balanceOf(receiver))).to.equal("1000.53");
            expect(formatBigNumberToUnits(await testTokenV1.balanceOf(receiver2))).to.equal("1000.0");
            expect(formatBigNumberToUnits(await testTokenV1.balanceOf(receiver3))).to.equal("1000.0");
            expect(formatBigNumberToUnits(await testTokenV1.balanceOf(receiver4))).to.equal("1000.0");
            expect(formatBigNumberToUnits(await testTokenV1.balanceOf(receiver5))).to.equal("1000.0");
        })
    
        // Test if owner is added as first holder during deployment
        it("At deployment owner should be added as first holder", async () => {
            const { _holderAddress, _holderIndex, _creationDate } = await testTokenV1.getHolderByAddress(owner);
            expect(_holderAddress).to.be.equal(owner.address);
            expect(Number(_holderIndex)).to.be.equal(1); 
            expect(Number(_creationDate)).to.not.be.equal(0);
        });
    
        // Test if new holders are added after transfers
        it("After transfer receiver should be added to holder list", async () => {
            await testTokenV1.connect(owner).transfer(receiver, formatUnitsToBigNumber("1000"));
    
            const { _holderAddress, _holderIndex, _creationDate } = await testTokenV1.getHolderByAddress(receiver);
            expect(_holderAddress).to.be.equal(receiver.address);
            expect(Number(_holderIndex)).to.be.equal(2); 
            expect(Number(_creationDate)).to.not.be.equal(0);
        })

        // Test duplicate holder prevention
        it("Should not add receiver if receiver is a holder already", async () => {
            await testTokenV1.connect(owner).transfer(receiver, formatUnitsToBigNumber("1000"));
            const { _holderAddress, _holderIndex, _creationDate } = await testTokenV1.getHolderByAddress(receiver);
            expect(_holderAddress).to.be.equal(receiver.address);
            expect(Number(_holderIndex)).to.be.equal(2); 
            expect(Number(_creationDate)).to.not.be.equal(0);

            await testTokenV1.connect(owner).transfer(receiver, formatUnitsToBigNumber("1000"));
            const { _holderAddress: secondHolderAddress, _holderIndex: secondHolderIndex, _creationDate: secondCreationDate } = await testTokenV1.getHolderByIndex(3);
            expect(secondHolderAddress).to.be.equal("0x0000000000000000000000000000000000000000");
            expect(Number(secondHolderIndex)).to.be.equal(0); 
            expect(Number(secondCreationDate)).to.be.equal(0);
        })
    })

    // Test suite for V2 contract functionality
    describe("TestToken V2", () => {
        // Test transfers after upgrade
        it("Transfer Test", async () => {
            await testTokenV1.connect(owner).transfer(receiver.address, formatUnitsToBigNumber("1000"));
    
            const TestTokenV2 = await ethers.getContractFactory("TestTokenV2");
            testTokenV2 = await upgrades.upgradeProxy(await testTokenV1.getAddress(), TestTokenV2, {
                call: { fn: "initializeV2", args: [owner.address.toString()] }
            });
            await testTokenV2.waitForDeployment();

            expect(formatBigNumberToUnits(await testTokenV2.balanceOf(owner))).to.equal("9000.0");
            expect(formatBigNumberToUnits(await testTokenV2.balanceOf(receiver))).to.equal("1000.0");

        })

        // Test if owner index remains unchanged after upgrade
        it("Is owner still index 1", async () => {
            const { _holderAddress, _holderIndex, _creationDate } = await testTokenV1.getHolderByAddress(owner);
            expect(_holderAddress).to.be.equal(owner.address);
            expect(Number(_holderIndex)).to.be.equal(1); 
            expect(Number(_creationDate)).to.not.be.equal(0);

            const TestTokenV2 = await ethers.getContractFactory("TestTokenV2");
            testTokenV2 = await upgrades.upgradeProxy(await testTokenV1.getAddress(), TestTokenV2, {
                call: { fn: "initializeV2", args: [owner.address.toString()] }
            });
            await testTokenV2.waitForDeployment();
            const { _holderAddress: a, _holderIndex: h, _creationDate: c } = await testTokenV2.getHolderByAddress(owner);
            expect(a).to.be.equal(owner.address);
            expect(Number(h)).to.be.equal(1); 
            expect(Number(c)).to.not.be.equal(0);
        });

        // Test if holder list remains functional after upgrade
        it("Is old holder list still usable", async () => {
            await testTokenV1.connect(owner).transfer(receiver, formatUnitsToBigNumber("1000"));
    
            const { _holderAddress, _holderIndex, _creationDate } = await testTokenV1.getHolderByAddress(receiver);
            expect(_holderAddress).to.be.equal(receiver.address);
            expect(Number(_holderIndex)).to.be.equal(2); 
            expect(_creationDate).to.not.be.equal(0);

            const TestTokenV2 = await ethers.getContractFactory("TestTokenV2");
            testTokenV2 = await upgrades.upgradeProxy(await testTokenV1.getAddress(), TestTokenV2, {
                call: { fn: "initializeV2", args: [owner.address.toString()] }
            });
            await testTokenV2.waitForDeployment();

            const { _holderAddress: a, _holderIndex: h, _creationDate: c } = await testTokenV2.getHolderByAddress(receiver);
            expect(a).to.be.equal(receiver.address);
            expect(Number(h)).to.be.equal(2); 
            expect(Number(c)).to.not.be.equal(0);
        })

        // Test new holder removal mechanism when balance becomes zero
        it("New holder mechanism should remove if sender's balance is 0", async () => {
            const TestTokenV2 = await ethers.getContractFactory("TestTokenV2");
            testTokenV2 = await upgrades.upgradeProxy(await testTokenV1.getAddress(), TestTokenV2, {
                call: { fn: "initializeV2", args: [owner.address.toString()] }
            });
            await testTokenV2.waitForDeployment();

            await testTokenV2.connect(owner).transfer(receiver, formatUnitsToBigNumber("10000.0"));
            expect(formatBigNumberToUnits(await testTokenV2.balanceOf(owner))).to.equal("0.0");
            expect(Number(await testTokenV2.getHolderIndex(owner))).to.equal(0);
        })

        // Test free indices management
        it("New holder mechanism should add removed user's index to freeIndices array", async () => {
            const TestTokenV2 = await ethers.getContractFactory("TestTokenV2");
            testTokenV2 = await upgrades.upgradeProxy(await testTokenV1.getAddress(), TestTokenV2, {
                call: { fn: "initializeV2", args: [owner.address.toString()] }
            });
            await testTokenV2.waitForDeployment();

            expect((await testTokenV2.getFreeIndices()).length).to.equal(0);
            await testTokenV2.connect(owner).transfer(receiver, formatUnitsToBigNumber("10000.0"));
            expect(formatBigNumberToUnits(await testTokenV2.balanceOf(owner))).to.equal("0.0");
            expect((await testTokenV2.getFreeIndices()).length).to.equal(1);
        
        })  

        // Test regular holder addition when no free indices are available
        it("New holder mechanism should add new holder regularly if there is no free index available", async () => {
            const TestTokenV2 = await ethers.getContractFactory("TestTokenV2");
            testTokenV2 = await upgrades.upgradeProxy(await testTokenV1.getAddress(), TestTokenV2, {
                call: { fn: "initializeV2", args: [owner.address.toString()] }
            });
            await testTokenV2.waitForDeployment();

            await testTokenV2.connect(owner).transfer(receiver, formatUnitsToBigNumber("1000.0"));
            await testTokenV2.connect(owner).transfer(receiver2, formatUnitsToBigNumber("1000.0"));
            await testTokenV2.connect(owner).transfer(receiver3, formatUnitsToBigNumber("1000.0"));
            await testTokenV2.connect(owner).transfer(receiver4, formatUnitsToBigNumber("1000.0"));
            await testTokenV2.connect(owner).transfer(receiver5, formatUnitsToBigNumber("1000.0"));

            expect(Number(await testTokenV2.getHolderIndex(receiver))).to.be.equal(2);
            expect(Number(await testTokenV2.getHolderIndex(receiver2))).to.be.equal(3);
            expect(Number(await testTokenV2.getHolderIndex(receiver3))).to.be.equal(4);
            expect(Number(await testTokenV2.getHolderIndex(receiver4))).to.be.equal(5);
            expect(Number(await testTokenV2.getHolderIndex(receiver5))).to.be.equal(6);

        })

        // Test holder addition using free indices when available
        it("New holder mechanism should add new holder with free index if available", async () => {
            const TestTokenV2 = await ethers.getContractFactory("TestTokenV2");
            testTokenV2 = await upgrades.upgradeProxy(await testTokenV1.getAddress(), TestTokenV2, {
                call: { fn: "initializeV2", args: [owner.address.toString()] }
            });
            await testTokenV2.waitForDeployment();

            await testTokenV2.connect(owner).transfer(receiver, formatUnitsToBigNumber("1000.0"));
            await testTokenV2.connect(owner).transfer(receiver2, formatUnitsToBigNumber("1000.0"));
            await testTokenV2.connect(owner).transfer(receiver3, formatUnitsToBigNumber("1000.0"));
            await testTokenV2.connect(owner).transfer(receiver4, formatUnitsToBigNumber("1000.0"));

            expect(Number(await testTokenV2.getHolderIndex(owner))).to.be.equal(1);
            expect(Number(await testTokenV2.getHolderIndex(receiver))).to.be.equal(2);
            expect(Number(await testTokenV2.getHolderIndex(receiver2))).to.be.equal(3);
            expect(Number(await testTokenV2.getHolderIndex(receiver3))).to.be.equal(4);
            expect(Number(await testTokenV2.getHolderIndex(receiver4))).to.be.equal(5);

            const { _holderAddress: rA, _holderIndex: rI, _creationDate: rC } = await testTokenV1.getHolderByAddress(receiver);
            expect(rA).to.equal(receiver.address);

            await testTokenV2.connect(receiver).transfer(owner, formatUnitsToBigNumber("1000.0"));

            expect(Number(await testTokenV2.getHolderIndex(receiver))).to.equal(0);
            expect(Number((await testTokenV2.getFreeIndices())[0])).to.equal(2);
            

            await testTokenV2.connect(owner).transfer(receiver5, formatUnitsToBigNumber("1000.0"));
            expect(Number(await testTokenV2.getHolderIndex(receiver5))).to.be.equal(2);
            const { _holderAddress: r5A, _holderIndex: r5I, _creationDate: r5C } = await testTokenV1.getHolderByAddress(receiver5);
            expect(r5A).to.equal(receiver5.address);
            expect(Number(r5I)).to.equal(2);
        }) 
    })
}) 