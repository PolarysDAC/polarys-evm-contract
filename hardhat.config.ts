import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-ethers";
import "@openzeppelin/hardhat-upgrades";
import "hardhat-gas-reporter";
import "solidity-coverage";

import * as dotenv from "dotenv";
dotenv.config();

const chainIds = {
  mainnet: 1,
  rinkeby: 4,
  ropsten: 3,
  mumbai: 80001,
  polygon: 137,
  bsc: 56,
  bscTestnet: 97,
  avalanche: 43114,
  fuji: 43113
};

const ALCHEMY_KEY = process.env.ALCHEMY_KEY || "";

const PRIVATE_KEY = process.env.PK || "";

const ETHERSCAN_KEY = process.env.ETHERSCAN_KEY || "";
const POLYGONSCAN_KEY = process.env.POLYGONSCAN_KEY || "";
const BSCSCAN_KEY = process.env.BSCSCAN_KEY || "";
const AVALANCHE_KEY = process.env.AVALANCHE_KEY || "";

const config = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337
    },
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${ALCHEMY_KEY}`,
      chainId: chainIds.rinkeby,
      accounts: [PRIVATE_KEY],
      gasMultiplier: 1.25
    },
    mainnet: {
      url: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`,
      chainId: chainIds.mainnet,
      accounts: [PRIVATE_KEY],
      gasMultiplier: 1.25
    },
    polygonMumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_KEY}`,
      chainId: chainIds.mumbai,
      accounts: [PRIVATE_KEY],
      gasMultiplier: 1.25
    }
  },
  etherscan: {
    apiKey: {
      // ethereum
      mainnet: ETHERSCAN_KEY,
      rinkeby: ETHERSCAN_KEY,
      // polygon
      polygon: POLYGONSCAN_KEY,
      polygonMumbai: POLYGONSCAN_KEY,
      // binance smart chain
      bsc: BSCSCAN_KEY,
      bscTestnet: BSCSCAN_KEY,
      // avalanche
      avalanche: AVALANCHE_KEY,
      avalancheFujiTestnet: AVALANCHE_KEY,
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.15",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  mocha: {
    timeout: 30000,
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  }
};

export default config;
