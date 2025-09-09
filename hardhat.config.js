require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: process.env.INFURA_URL,    // Infura endpoint
      accounts: [process.env.PRIVATE_KEY] // Test account private key
    }
  }
};
