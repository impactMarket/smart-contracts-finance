import { HardhatUserConfig } from "hardhat/config";
import '@nomicfoundation/hardhat-chai-matchers';
import '@nomicfoundation/hardhat-ethers';
import '@typechain/hardhat';
import 'hardhat-gas-reporter';
import 'solidity-coverage';
import '@openzeppelin/hardhat-upgrades';
import '@nomicfoundation/hardhat-ethers';
import 'hardhat-deploy';
import 'hardhat-deploy-ethers';
import * as dotenv from 'dotenv';

export function getConfig(configName: string, network: string) : string {
  const configs = (dotenv.config({
    path: `.env.${network}`,
  })).parsed;

  return configs[configName];
}

const config: HardhatUserConfig = {
  networks: {
    hardhat: {
      hardfork: "istanbul",
      allowUnlimitedContractSize: true,
      timeout: 100000,
      gasPrice: "auto",
      gas: 13000000,
      forking: {
        chainId: 42220,
        url: "https://forno.celo.org"
      },
    },
    alfajores: {
      chainId: 44787,
      url: "https://alfajores-forno.celo-testnet.org",
      hardfork: "istanbul",
      accounts: [getConfig('DEPLOYER_PRIVATE_KEY', 'alfajores')],
      allowUnlimitedContractSize: true,
      gas: "auto",
      gasPrice: "auto",
      blockGasLimit: 13000000,
    },
    mainnet: {
      chainId: 42220,
      url: "https://forno.celo.org",
      hardfork: "istanbul",
      accounts: [getConfig('DEPLOYER_PRIVATE_KEY', 'mainnet')],
      allowUnlimitedContractSize: true,
      gasPrice: "auto",
      gas: "auto",
      blockGasLimit: 13000000,
    }
  },
  solidity: {
    compilers: [
      {
        version: "0.8.19",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      }
    ],
  },
};

export default config;
