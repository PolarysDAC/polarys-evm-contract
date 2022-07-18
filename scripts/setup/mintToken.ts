import { ethers } from 'hardhat';
import { formatUnits } from "ethers/lib/utils";
import { TestToken, DepositContract } from "../../typechain-types";

import 'dotenv/config';
import { load } from "../utils"
import {
  getBigNumber,
} from '../../test/utils'

import { Signer } from 'ethers';

async function main () {
  let signer: Signer
  let depositContract: DepositContract
  let testTokenContract: TestToken

  const DECIMAL = 6
  const DEST_ADDRESS = "0xfd779b9b1176EF1EB69a8fAD435014dbC55edB3f"
  const depositContractAddress = (await load('DepositContract')).address
  const testTokenAddress = (await load('TestTokenContract')).address

  depositContract = (await ethers.getContractAt("DepositContract", depositContractAddress)) as DepositContract;
  testTokenContract = (await ethers.getContractAt("TestToken", testTokenAddress)) as TestToken;
  [signer] = await ethers.getSigners()
  
  await (
    await testTokenContract
    .connect(signer)
    .mint(DEST_ADDRESS, getBigNumber(10000, DECIMAL))
  ).wait();

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });