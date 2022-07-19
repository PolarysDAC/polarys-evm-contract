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
  const USER_PK = process.env.USER_PK
  const quantity = 3
  const amount = getBigNumber(661.5, DECIMAL)
  const deadline = 1658187166

  const sign = "0xc07d68cd199461dd36962aaf71069663ae445bd6cda040d7de8d420c17d7edc942c4c8d0d4f83aa4c11157249543df42f20a37197d2f2306f4b836bcc38536601c"
  const depositContractAddress = (await load('DepositContract')).address
  const testTokenAddress = (await load('TestTokenContract')).address

  depositContract = (await ethers.getContractAt("DepositContract", depositContractAddress)) as DepositContract;
  testTokenContract = (await ethers.getContractAt("TestToken", testTokenAddress)) as TestToken;
  [signer] = await ethers.getSigners()
  // let userSigner: Signer = new ethers.Wallet(String(USER_PK))
  
  await (
    await testTokenContract
    .connect(signer)
    .approve(depositContract.address, amount)
  ).wait();

  await (
    await depositContract
    .connect(signer)
    .depositToken(quantity, amount, deadline, sign)
  ).wait();

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });