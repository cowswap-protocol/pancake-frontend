import tokens from './tokens'
import { FarmConfig } from './types'

const farms: FarmConfig[] = [
  {
    pid: 0,
    lpSymbol: 'COWB-BNB LP',
    lpAddresses: {
      97: '0x4abF05933ba652b70e1E1Eb85a01BB2a380b00E9',
      56: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
    },
    token: tokens.mockusdt,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 1,
    lpSymbol: 'COWB-USDT LP',
    lpAddresses: {
      97: '0x50B956e51d48aa45748678fc56490c3eD4b34d12',
      56: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
    },
    token: tokens.mockusdt,
    quoteToken: tokens.wbnb,
  },
]

export default farms
