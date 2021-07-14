import BigNumber from 'bignumber.js'
import erc20ABI from 'config/abi/erc20.json'
import potABI from 'config/abi/pot.json'
import multicall from 'utils/multicall'
import { getAddress } from 'utils/addressHelpers'
import { getDate } from 'utils/getTimePeriods'
import { PotConfig } from 'config/constants/types'
import { POT_ADDRESS } from 'config/constants/pots'


const POT = getAddress(POT_ADDRESS)

export const fetchPotUserData = async (account: string, potsToFetch: PotConfig[]) => {
  const rewardsCalls = potsToFetch.map((pot) => {
    return {
      address: POT,
      name: 'getRewards',
      params: [account, getAddress(pot.stakingToken.address)],
    }
  })
  const today = getDate()
  const volumesCalls = potsToFetch.map((pot) => {
    return {
      address: POT,
      name: 'userDayVolumes',
      params: [account, today, getAddress(pot.stakingToken.address)],
    }
  })

  const rawRewards = await multicall(potABI, rewardsCalls)
  const rawVolumes = await multicall(potABI, volumesCalls)
  return potsToFetch.map((pot, index) => {
    return {
      sousId: pot.sousId,
      stakedBalance: rawVolumes[index].toString(),
      pendingRewards: rawRewards[index].pending.toString(),
      unclaimRewards: rawRewards[index].rewards.toString(),
    }
  })
}

export const fetchPotsPublicData = async (potsToFetch: PotConfig[], date?: number) => {

  const calls = potsToFetch.map((pot) => {
    return {
      address: POT,
      name: 'dayVolumes',
      params: [date || getDate(), getAddress(pot.stakingToken.address)],
    }
  })

  const rawVolumes = await multicall(potABI, calls)

  return potsToFetch.map((pot, index) => {
    return {
      sousId: pot.sousId,
      todayTotalStaked: rawVolumes[index].toString(),
    }
  })
}

export default fetchPotUserData