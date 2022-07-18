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
  const deadline = 1658172498

  const sign = "0x1b819d3d9bbf1b114896158a2fb4122be11c417a151d8b733b8bb06755960ed3398b246309dad21237f737b96eb5a2468cb141b60aaa82da4b7a8fa1b96a422a1c"
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