import BigNumber from 'bignumber.js'
import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useAppDispatch } from 'state'
import { 
  fetchMarketplaceOrdersAsync,
  fetchNftOrderAsync,
  fetchUserOrdersAsync 
} from 'state/actions'
import { removeOrder, updateNftItemListed } from 'state/marketplace'
import { DEFAULT_TOKEN_DECIMAL } from 'config'
import { useMarektplaceContract } from './useContract'

export const useCreateOrder = () => {
  const { account } = useWeb3React()
  const contract = useMarektplaceContract()
  const dispatch = useAppDispatch()

  const handleCreateOrder = useCallback(async (nftAddress: string, nftId: string, price: string) => {
    const priceWei = new BigNumber(price).times(DEFAULT_TOKEN_DECIMAL)
    const txHash = await contract.methods.createOrder(nftAddress, nftId, priceWei.toString()).send({ from: account })
    dispatch(fetchMarketplaceOrdersAsync())
    dispatch(fetchUserOrdersAsync(account))
    dispatch(updateNftItemListed({ id: nftId, listed: true }))
    return txHash
  }, [account, contract, dispatch])

  return { onCreateOrder: handleCreateOrder }
}

export const useBuy = () => {
  const { account } = useWeb3React()
  const contract = useMarektplaceContract()
  const dispatch = useAppDispatch()

  const handleBuyOrder = useCallback(async (orderId: string, price: string) => {
    const priceWei = new BigNumber(price).times(DEFAULT_TOKEN_DECIMAL)
    const txHash = await contract.methods.buy(orderId).send({ value: priceWei.toString(), from: account })
    dispatch(fetchNftOrderAsync(orderId))
    dispatch(removeOrder(parseInt(orderId)))
    return txHash
  }, [account, contract, dispatch])

  return { onBuy: handleBuyOrder }
}

export const useCancelOrder = () => {
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()
  const contract = useMarektplaceContract()

  const handleCancelOrder = useCallback(async (orderId: string) => {
    const txHash = await contract.methods.cancelOrder(orderId).send({ from: account })
    dispatch(removeOrder(parseInt(orderId)))
    return txHash
  }, [account, contract, dispatch])

  return { onCancelOrder: handleCancelOrder }
}

export const useChangePrice = () => {
  const { account } = useWeb3React()
  const contract = useMarektplaceContract()
  const dispatch = useAppDispatch()

  const handleChangePrice = useCallback(async (orderId: string, price: string) => {
    const priceWei = new BigNumber(price).times(DEFAULT_TOKEN_DECIMAL)
    const txHash = await contract.methods.changePrice(orderId, priceWei.toString()).send({ from: account })
    dispatch(fetchNftOrderAsync(orderId))
    return txHash
  }, [account, contract, dispatch])

  return { onChangePrice: handleChangePrice }
}

export default useCreateOrder