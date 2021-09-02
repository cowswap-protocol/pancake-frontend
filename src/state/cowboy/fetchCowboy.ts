import BigNumber from 'bignumber.js'
import cowboyConfig from 'config/constants/cowboy'
import tokens from 'config/constants/tokens'
import cowboyABI from 'config/abi/cowboy.json'
import erc20 from 'config/abi/erc20.json'
import multicall from 'utils/multicall'
import { getAddress } from 'utils/addressHelpers'
import { BIG_TEN, BIG_ZERO } from 'utils/bigNumber'
import { getCowboyApr } from 'utils/apr'


export const fetchCowboyPublicData = async () => {

  const calls = [
    {
      address: getAddress(cowboyConfig.address),
      name: 'price',
    },
    {
      address: getAddress(cowboyConfig.address),
      name: 'totalSupply',
    },
    {
      address: getAddress(cowboyConfig.address),
      name: 'rewardsPerBlock',
    }
  ]

  const [ rawPrice, totalSupply, rewardsPerBlock ] = await multicall(cowboyABI, calls)
  const price = new BigNumber(rawPrice).div(BIG_TEN.pow(18))
  const totalStaked = new BigNumber(totalSupply).times(price).div(BIG_TEN.pow(18))
  const tokensPerBlock  = new BigNumber(rewardsPerBlock).div(BIG_TEN.pow(18))
  const apr = getCowboyApr(totalStaked.toNumber(), tokensPerBlock.toNumber())
  return {
    apr,
    price: price ? price.toJSON() : '0',
    totalSupply: totalSupply ? new BigNumber(totalSupply).div(BIG_TEN.pow(cowboyConfig.decimals)).toJSON() : '0',
    totalStaked: totalStaked ? totalStaked.toJSON() : '0'
  }
}

export const fetchCowboyUserData = async(account: string) => {
  const calls = [
    {
      address: getAddress(cowboyConfig.address),
      name: 'balanceOf',
      params: [ account ]
    },
    {
      address: getAddress(tokens.cowb.address),
      name: 'balanceOf',
      params: [ account ]
    },
    {
      address: getAddress(tokens.cowb.address),
      name: 'allowance',
      params: [ account, getAddress(cowboyConfig.address) ]
    }
  ]

  const [ cowboyBalance, cowbBalance, allowance ] = await multicall(erc20, calls)


  return {
    allowance: new BigNumber(allowance).div(BIG_TEN.pow(tokens.cowb.decimals)).toJSON(),
    cowbBalance: new BigNumber(cowbBalance).div(BIG_TEN.pow(tokens.cowb.decimals)).toJSON(),
    cowboyBalance: new BigNumber(cowboyBalance).div(BIG_TEN.pow(cowboyConfig.decimals)).toJSON()
  }
}


