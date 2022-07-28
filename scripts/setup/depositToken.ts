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
  const deadline = 1658879424

  const sign = "0x4755611c81e7d95232d626ec79f56040d7f8a1dfe9dc702d50a1d63c9fdc70fa79d86488025ebe7b3d8153f6f3da2915176efddc349e2529cad9c73facda47dd1c"
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