import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useAppDispatch } from 'state'
import { updateUserBalance, updateUserPendingReward } from 'state/actions'
import { soushHarvest, soushHarvestBnb, harvest, claim, collect } from 'utils/callHelpers'
import { useMasterchef, useSousChef, usePotContract } from './useContract'

export const useHarvest = (farmPid: number) => {
  const { account } = useWeb3React()
  const masterChefContract = useMasterchef()

  const handleHarvest = useCallback(async () => {
    const txHash = await harvest(masterChefContract, farmPid, account)
    return txHash
  }, [account, farmPid, masterChefContract])

  return { onReward: handleHarvest }
}

export const useSousHarvest = (sousId, isUsingBnb = false) => {
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const sousChefContract = useSousChef(sousId)
  const masterChefContract = useMasterchef()

  const handleHarvest = useCallback(async () => {
    if (sousId === 0) {
      await harvest(masterChefContract, 0, account)
    } else if (isUsingBnb) {
      await soushHarvestBnb(sousChefContract, account)
    } else {
      await soushHarvest(sousChefContract, account)
    }
    dispatch(updateUserPendingReward(sousId, account))
    dispatch(updateUserBalance(sousId, account))
  }, [account, dispatch, isUsingBnb, masterChefContract, sousChefContract, sousId])

  return { onReward: handleHarvest }
}

export const useClaim = (token: string) => {
  const { account } = useWeb3React()
  const potContract = usePotContract()

  const handleHarvest = useCallback(async () => {
    const txHash = await claim(potContract, account, token)
    return txHash
  }, [account, potContract, token])

  return { onReward: handleHarvest }
}

export const useCollect = (token: string) => {
  const { account } = useWeb3React()
  const potContract = usePotContract()

  const handleHarvest = useCallback(async () => {
    const txHash = await collect(potContract, account, token)
    return txHash
  }, [account, potContract, token])

  return { onCollect: handleHarvest }
}
