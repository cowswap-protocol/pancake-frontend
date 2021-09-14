import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { Contract } from 'web3-eth-contract'
import { getLotteryAddress, getMarketplaceAddress } from 'utils/addressHelpers'
import { BIG_ZERO } from 'utils/bigNumber'
import { getErc721Contract } from 'utils/contractHelpers'
import { useCake } from './useContract'
import useRefresh from './useRefresh'

// Retrieve lottery allowance
export const useLotteryAllowance = () => {
  const [allowance, setAllowance] = useState(BIG_ZERO)
  const { account } = useWeb3React()
  const cakeContract = useCake()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchAllowance = async () => {
      const res = await cakeContract.methods.allowance(account, getLotteryAddress()).call()
      setAllowance(new BigNumber(res))
    }

    if (account) {
      fetchAllowance()
    }
  }, [account, cakeContract, fastRefresh])

  return allowance
}

// Retrieve IFO allowance
export const useIfoAllowance = (tokenContract: Contract, spenderAddress: string, dependency?: any): BigNumber => {
  const { account } = useWeb3React()
  const [allowance, setAllowance] = useState(BIG_ZERO)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await tokenContract.methods.allowance(account, spenderAddress).call()
        setAllowance(new BigNumber(res))
      } catch (e) {
        console.error(e)
      }
    }

    if (account) {
      fetch()
    }
  }, [account, spenderAddress, tokenContract, dependency])

  return allowance
}

export const useErc721Approved = (nftAddress: string, spenderAddress: string, tokenId: number): boolean => {
  const { account } = useWeb3React()
  const [approved, setApproved] = useState(false)
  const { fastRefresh } = useRefresh()
  useEffect(() => {
    const fetch = async () => {
      try {
        const erc721Contract = getErc721Contract(nftAddress)
        const isApprovedForAll = await erc721Contract.methods.isApprovedForAll(account, spenderAddress).call()
        if(isApprovedForAll) {
          setApproved(true)
          return
        }
        const spender = await erc721Contract.methods.getApproved(tokenId).call()
        const owner = await erc721Contract.methods.ownerOf(tokenId).call()
        setApproved(isApprovedForAll || spender === spenderAddress || owner === getMarketplaceAddress() )
      } catch (e) {
        console.error(e)
      }
    }

    if (account && nftAddress && tokenId) {
      fetch()
    }
  }, [account, spenderAddress, nftAddress, tokenId, fastRefresh ])

  return approved
}
