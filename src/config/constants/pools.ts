import tokens from './tokens'
import { PoolConfig, PoolCategory } from './types'

const pools: PoolConfig[] = [
  {
    sousId: 0,
    stakingToken: tokens.cake,
    earningToken: tokens.cake,
    contractAddress: {
      97: '0xd3af5fe61dbaf8f73149bfcfa9fb653ff096029a',
      56: '0x73feaa1eE314F8c655E354234017bE2193C9E24E',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '10',
    sortOrder: 1,
    isFinished: false,
  },
  {
    sousId: 189,
    stakingToken: tokens.cake,
    earningToken: tokens.bscpad,
    contractAddress: {
      97: '',
      56: '0x0446b8f8474c590d2249a4acdd6eedbc2e004bca',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    sortOrder: 999,
    tokenPerBlock: '0.3877',
  },
  {
    sousId: 188,
    stakingToken: tokens.cake,
    earningToken: tokens.rabbit,
    contractAddress: {
      97: '',
      56: '0x391240A007Bfd8A59bA74978D691219a76c64c5C',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    sortOrder: 999,
    tokenPerBlock: '3.993',
  },
  {
    sousId: 187,
    stakingToken: tokens.cake,
    earningToken: tokens.waultx,
    contractAddress: {
      97: '',
      56: '0x017DEa5C58c2Bcf57FA73945073dF7AD4052a71C',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    sortOrder: 999,
    tokenPerBlock: '7.9108',
  }
]

export default pools
