import tokens from './tokens'
import { FarmConfig } from './types'

const farms: FarmConfig[] = [
  /**
   * These 3 farms (PID 0, 251, 252) should always be at the top of the file.
   */
  {
    pid: 0,
    lpSymbol: 'CAKE',
    lpAddresses: {
      97: '0x9C21123D94b93361a29B2C2EFB3d5CD8B17e0A9e',
      56: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
    },
    token: tokens.syrup,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 251,
    lpSymbol: 'CAKE-BNB LP',
    lpAddresses: {
      97: '0x3ed8936cAFDF85cfDBa29Fbe5940A5b0524824F4',
      56: '0x0eD7e52944161450477ee417DE9Cd3a859b14fD0',
    },
    token: tokens.cake,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 252,
    lpSymbol: 'BUSD-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16',
    },
    token: tokens.busd,
    quoteToken: tokens.wbnb,
  },
  /**
   * V3 by order of release (some may be out of PID order due to multiplier boost)
   */
  {
    pid: 421,
    lpSymbol: 'BSCPAD-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xba01662e978de7d67f8ffc937726215eb8995d17',
    },
    token: tokens.bscpad,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 420,
    lpSymbol: 'RABBIT-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x04b56A5B3f45CFeaFbfDCFc999c14be5434f2146',
    },
    token: tokens.rabbit,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 419,
    lpSymbol: 'WAULTx-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x3e4370204f598205998143F07ebCC486E441b456',
    },
    token: tokens.waultx,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 418,
    lpSymbol: 'WEX-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x547A355E70cd1F8CAF531B950905aF751dBEF5E6',
    },
    token: tokens.wex,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 417,
    lpSymbol: 'FORM-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x3E19C18Fe3458A6065D8F0844cB7Eae52C9DAE07',
    },
    token: tokens.form,
    quoteToken: tokens.busd,
  },
  {
    pid: 416,
    lpSymbol: 'ORBS-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0xB87b857670A44356f2b70337E0F218713D2378e8',
    },
    token: tokens.orbs,
    quoteToken: tokens.busd,
  },
]

export default farms
