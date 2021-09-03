import tokens from './tokens'
import { FarmConfig } from './types'

const farms: FarmConfig[] = [
  {
    pid: 0,
    lpSymbol: 'COWB-BNB LP',
    lpAddresses: {
      97: '0x4629862B2d9211895515EB43491020Bd891FEAF5',
      56: '0x4D5AC000a621312208244e42cB4C1AF2A4f17c44',
    },
    token: tokens.cowb,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 1,
    lpSymbol: 'COWB-BUSD LP',
    lpAddresses: {
      97: '0x2833271C321E126BECAc271b2BCF90d5b0660165',
      56: '0xbE1470D3bf6255904fdd707a9f631429c2723395',
    },
    token: tokens.cowb,
    quoteToken: tokens.busd,
  },
]

export default farms
