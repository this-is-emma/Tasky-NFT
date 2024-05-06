import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from 'dotenv';

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    holesky: {
      url: process.env.INFURA_HOLESKY_ENDPOINT,
      accounts: [process.env.PRIVATE_KEY ?? ""]
    }
  }
};

export default config;
