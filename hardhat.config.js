require('@openzeppelin/hardhat-upgrades');  // Bu satırın bulunduğundan emin olun

module.exports = {
  solidity: "0.8.28", // Kullanmakta olduğunuz Solidity sürümü
  networks: {
    hardhat: {
      chainId: 1337,  // Test ağı için
    },
  },
};
