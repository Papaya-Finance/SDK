require('@nomicfoundation/hardhat-chai-matchers');
require('@nomicfoundation/hardhat-ethers')
require('hardhat-dependency-compiler');
require('hardhat-tracer');
require('@typechain/hardhat')
require('dotenv').config();

module.exports = {
    solidity: {
      compilers: [
        {
          version: '0.8.24',
          settings: {
            optimizer: {
              enabled: true,
              runs: 1_000_000,
            },
            viaIR: true,
          },
        },
      ]
    },
    namedAccounts: {
        deployer: {
            default: 0,
        },
    },
    defaultNetwork: "hardhat",
    namedAccounts: {
      deployer: {
          default: 0,
      },
    },
    networks: {
      hardhat: {
        chainId: 31337,
        blockGasLimit: 30000000,
        gasPrice: 70_000_000_000,
        mining:{
          auto: true,
          interval: 5000
        }
      },
    },
};
