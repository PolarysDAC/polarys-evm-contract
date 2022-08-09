import { ethers, upgrades } from 'hardhat'
import { save } from "./utils"

import * as dotenv from "dotenv";
dotenv.config();

async function main() {
    const tokenAddress = process.env.DEPOSIT_TOKEN_ADDRESS!;
    const merkleRoot = process.env.MERKLE_ROOT!
    const factory = await ethers.getContractFactory("DepositContract");
    const depositContract = await factory.deploy(tokenAddress, merkleRoot);
    await depositContract.deployed();
    console.log("DepositContract deployed to:", depositContract.address);
    await save('DepositContract', {
        address: depositContract.address
    });
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});