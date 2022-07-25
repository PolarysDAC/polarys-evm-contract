import { ethers } from 'hardhat';
import { formatUnits } from "ethers/lib/utils";
import { providers } from 'ethers';
import { TestToken, DepositContract } from "../../typechain-types";

import 'dotenv/config';
import { load } from "../utils"
import {
  getBigNumber,
} from '../../test/utils'

import { Signer } from 'ethers';

const ALCHEMY_KEY = process.env.ALCHEMY_KEY || "";

async function main () {
  let signer: Signer
  let depositContract: DepositContract
  let testTokenContract: TestToken

  const DECIMAL = 6
  const USER_PK = process.env.USER_PK
  const quantity = 3
  const amount = getBigNumber(661.5, DECIMAL)
  const deadline = 1658276196

  const sign = "0xfeb13d8b30449b317d9bb873c323ab5bad525fd8a7254da2031abb990e1e1de32bf9b40c26a7763e5aa9cb7cac6f756c4f75258c564135f2a494353dda65b3b11b"
  const depositContractAddress = (await load('DepositContract')).address
  const testTokenAddress = (await load('TestTokenContract')).address

  depositContract = (await ethers.getContractAt("DepositContract", depositContractAddress)) as DepositContract;
  testTokenContract = (await ethers.getContractAt("TestToken", testTokenAddress)) as TestToken;
  // [signer] = await ethers.getSigners()
  
  //rinkeby provider
  const provider = await new providers.JsonRpcProvider("https://eth-rinkeby.alchemyapi.io/v2/nKqhgMRUZJSw0baczgK177tpL59bae_j");

  //mumbai provider
  // const provider = await new providers.JsonRpcProvider("https://polygon-mumbai.g.alchemy.com/v2/2nMHQF5YQQybtCijNX-tNWi9qo7PObMx");
  let userSigner: Signer = new ethers.Wallet(String(USER_PK), provider)
  
  await (
    await testTokenContract
    .connect(userSigner)
    .approve(depositContract.address, amount)
  ).wait();

  await (
    await depositContract
    .connect(userSigner)
    .depositToken(quantity, amount, deadline, sign)
  ).wait();

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });