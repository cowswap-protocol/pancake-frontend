import BigNumber from 'bignumber.js'
import { Farm, Pool, LpPrice } from 'state/types'
import { getAddress } from 'utils/addressHelpers'
import { BIG_ZERO } from 'utils/bigNumber'

export const getTokenPricesFromLp = (farms: LpPrice[]) => {
  return farms.reduce((prices, farm) => {
    const quoteTokenAddress = getAddress(farm.quoteToken.address).toLocaleLowerCase()
    const tokenAddress = getAddress(farm.token.address).toLocaleLowerCase()
    /* eslint-disable no-param-reassign */
    if (!prices[quoteTokenAddress]) {
      prices[quoteTokenAddress] = new BigNumber(farm.quoteToken.busdPrice).toNumber()
    }
    if (!prices[tokenAddress]) {
      prices[tokenAddress] = new BigNumber(farm.token.busdPrice).toNumber()
    }
    /* eslint-enable no-param-reassign */
    return prices
  }, {})
}


export default getTokenPricesFromLp