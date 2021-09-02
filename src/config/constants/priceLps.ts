import tokens from './tokens'
import { PriceConfig } from './types'

const priceLps: PriceConfig[] = [
  {
    lpSymbol: 'BNB-BUSD LP',
    lpAddresses: {
      97: '0xf63bb38ad273b1f8c1bfdf4a3d2231a919acd835',
      56: '0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16',
    },
    token: tokens.wbnb,
    quoteToken: tokens.busd,
  },
  {
    lpSymbol: 'BNB-COWB LP',
    lpAddresses: {
      97: '0x4629862B2d9211895515EB43491020Bd891FEAF5',
      56: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
    },
    token: tokens.cowb,
    quoteToken: tokens.wbnb,
  },
  {
    lpSymbol: 'COWB-USDT LP',
    lpAddresses: {
      97: '0x2833271C321E126BECAc271b2BCF90d5b0660165',
      56: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
    },
    token: tokens.cowb,
    quoteToken: tokens.usdt,
  },
]

export default priceLps
