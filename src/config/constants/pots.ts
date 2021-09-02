import tokens from './tokens'
import { PotConfig, Address } from './types'


const pots: PotConfig[] = [
  {
    sousId: 0,
    stakingToken: tokens.wbnb,
    earningToken: tokens.cowb,
    startTime: 1630392797,
    endTime: 1630997597,
    dailyRewards: '10000000000',
    userDailyMax: '0',
    isFinished: false,
    harvest: true,
    quoteToken: tokens.wbnb,
  },

  
  {
    sousId: 1,
    stakingToken: tokens.usdt,
    earningToken: tokens.cowb,
    startTime: 1630392797,
    endTime: 1630997597,
    dailyRewards: '10000000000',
    userDailyMax: '100000',
    isFinished: false,
    harvest: true,
    quoteToken: tokens.usdt,
  },
]

export const POT_ADDRESS: Address = {
    56: '0x0829594194Aa3F0a0D93A4E314be7234d34aBba5',
    // 97: '0x9fA793807E120E85a51c1E52483D528Ef930d0d7'
    97: '0xCD08875680DD1009454249b7BC2CfDdA122D52f3'
};

export default pots
