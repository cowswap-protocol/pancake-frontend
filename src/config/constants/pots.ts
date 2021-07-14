import tokens from './tokens'
import { PotConfig, Address } from './types'


const pots: PotConfig[] = [
  {
    sousId: 0,
    stakingToken: tokens.mockusdt,
    earningToken: tokens.cowb,
    startTime: 1626059923,
    endTime: 1626491947,
    dailyRewards: '100000000000000000000000000',
    userDailyMax: '100000000000000000000000',
    isFinished: false,
    harvest: true,
    lpAddresses: {
       56: "",
       97: "xxxx"
    },
    quoteToken: tokens.wbnb,
  },

  {
    sousId: 1,
    stakingToken: tokens.mockusdt,
    earningToken: tokens.cowb,
    startTime: 1626491947,
    endTime: 1626492947,
    dailyRewards: '100000000000000000000000000',
    userDailyMax: '100000000000000000000000',
    isFinished: false,
    harvest: true,
    lpAddresses: {
       56: "",
       97: "xxxx"
    },
    quoteToken: tokens.wbnb,
  },
]

export const POT_ADDRESS: Address = {
    56: '',
    97: '0x9fA793807E120E85a51c1E52483D528Ef930d0d7'
};

export default pots
