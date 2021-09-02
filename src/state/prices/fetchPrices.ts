import BigNumber from 'bignumber.js'
import priceLps from 'config/constants/priceLps'
import erc20 from 'config/abi/erc20.json'
import multicall from 'utils/multicall'
import { getAddress } from 'utils/addressHelpers'
import { BIG_ZERO, BIG_TEN, BIG_ONE  } from 'utils/bigNumber'
import { filterFarmsByQuoteToken } from 'utils/farmsPriceHelpers'
import { LpPrice } from 'state/types'


const getLpFromTokenSymbol = (farms: LpPrice[], tokenSymbol: string, preferredQuoteTokens: string[] = ['BUSD', 'wBNB']): LpPrice => {
  const farmsWithTokenSymbol = farms.filter((farm) => farm.token.symbol === tokenSymbol)
  const filteredFarm  = farmsWithTokenSymbol.find((farm) => {
    return preferredQuoteTokens.some((quoteToken) => {
      return farm.quoteToken.symbol === quoteToken
    })
  })
  return filteredFarm
}

const getBaseTokenPrice = (farm: LpPrice, quoteTokenFarm: LpPrice, bnbPriceBusd: BigNumber): BigNumber => {
  const hasTokenPriceVsQuote = Boolean(farm.tokenPriceVsQuote)

  if (farm.quoteToken.symbol === 'BUSD' || farm.quoteToken.symbol === 'USDT') {
    return hasTokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote) : BIG_ZERO
  }

  if (farm.quoteToken.symbol === 'wBNB') {
    return hasTokenPriceVsQuote ? bnbPriceBusd.times(farm.tokenPriceVsQuote) : BIG_ZERO
  }

  // We can only calculate profits without a quoteTokenFarm for BUSD/BNB farms
  if (!quoteTokenFarm) {
    return BIG_ZERO
  }

  // Possible alternative farm quoteTokens:
  // UST (i.e. MIR-UST), pBTC (i.e. PNT-pBTC), BTCB (i.e. bBADGER-BTCB), ETH (i.e. SUSHI-ETH)
  // If the farm's quote token isn't BUSD or wBNB, we then use the quote token, of the original farm's quote token
  // i.e. for farm PNT - pBTC we use the pBTC farm's quote token - BNB, (pBTC - BNB)
  // from the BNB - pBTC price, we can calculate the PNT - BUSD price
  if (quoteTokenFarm.quoteToken.symbol === 'wBNB') {
    const quoteTokenInBusd = bnbPriceBusd.times(quoteTokenFarm.tokenPriceVsQuote)
    return hasTokenPriceVsQuote && quoteTokenInBusd
      ? new BigNumber(farm.tokenPriceVsQuote).times(quoteTokenInBusd)
      : BIG_ZERO
  }

  if (quoteTokenFarm.quoteToken.symbol === 'BUSD' || quoteTokenFarm.quoteToken.symbol === 'USDT') {
    const quoteTokenInBusd = quoteTokenFarm.tokenPriceVsQuote
    return hasTokenPriceVsQuote && quoteTokenInBusd
      ? new BigNumber(farm.tokenPriceVsQuote).times(quoteTokenInBusd)
      : BIG_ZERO
  }

  // Catch in case token does not have immediate or once-removed BUSD/wBNB quoteToken
  return BIG_ZERO
}

const getQuoteTokenPrice = (farm: LpPrice, quoteTokenFarm: LpPrice, bnbPriceBusd: BigNumber): BigNumber => {
  if (farm.quoteToken.symbol === 'BUSD' || farm.quoteToken.symbol === 'USDT') {
    return BIG_ONE
  }

  if (farm.quoteToken.symbol === 'wBNB') {
    return bnbPriceBusd
  }

  if (!quoteTokenFarm) {
    return BIG_ZERO
  }

  if (quoteTokenFarm.quoteToken.symbol === 'wBNB') {
    return quoteTokenFarm.tokenPriceVsQuote ? bnbPriceBusd.times(quoteTokenFarm.tokenPriceVsQuote) : BIG_ZERO
  }

  if (quoteTokenFarm.quoteToken.symbol === 'BUSD' || quoteTokenFarm.quoteToken.symbol === 'USDT') {
    return quoteTokenFarm.tokenPriceVsQuote ? new BigNumber(quoteTokenFarm.tokenPriceVsQuote) : BIG_ZERO
  }

  return BIG_ZERO
}

const calcTokenPrices = async (lps) => {
  const bnbBusdLP = lps.find((lp) => lp.lpSymbol === 'BNB-BUSD LP')
  const bnbPriceBusd = bnbBusdLP.tokenPriceVsQuote ? new BigNumber(bnbBusdLP.tokenPriceVsQuote) : BIG_ZERO

  const lpsWithPrices = lps.map((lp) => {
    const quoteTokenLp = getLpFromTokenSymbol(lps, lp.quoteToken.symbol)
    const baseTokenPrice = getBaseTokenPrice(lp, quoteTokenLp, bnbPriceBusd)
    const quoteTokenPrice = getQuoteTokenPrice(lp, quoteTokenLp, bnbPriceBusd)
    const token = { ...lp.token, busdPrice: baseTokenPrice.toJSON() }
    const quoteToken = { ...lp.quoteToken, busdPrice: quoteTokenPrice.toJSON() }
    return { ...lp, token, quoteToken }
  })

  return lpsWithPrices
}


export const fetchPrices = async () => {
  const calls = priceLps.map((lp) => {
    return [
      {
        address: getAddress(lp.quoteToken.address),
        name: 'balanceOf',
        params: [getAddress(lp.lpAddresses)],
      },
      {
        address: getAddress(lp.token.address),
        name: 'balanceOf',
        params: [getAddress(lp.lpAddresses)],
      }
    ]
  }).flat()

  const balances = await multicall(erc20, calls)

  const prices = await calcTokenPrices(priceLps.map((lp, i) => {
    const quoteTokenBalance = new BigNumber(balances[2 * i]).div(BIG_TEN.pow(lp.quoteToken.decimals))
    const tokenBalance = new BigNumber(balances[2 * i + 1]).div(BIG_TEN.pow(lp.token.decimals))
    return {
      ...lp,
      tokenPriceVsQuote: quoteTokenBalance.div(tokenBalance).toString()
    }
  }))
  return prices
}

export default fetchPrices
