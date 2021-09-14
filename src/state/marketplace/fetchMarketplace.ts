import BigNumber from 'bignumber.js'
import marketplaceABI from 'config/abi/marketplace.json'
import multicall from 'utils/multicall'
import { getMarketplaceAddress } from 'utils/addressHelpers'
// import { BIG_TEN, BIG_ZERO } from 'utils/bigNumber'

const fetchOrders = async(ids: number[]) => {
  const calls = ids.map(id => {
    return {
      address: getMarketplaceAddress(),
      name: 'getOrder',
      params: [ id ]
    }
  })
  const orders = await multicall(marketplaceABI, calls)
  return orders.map(order => {
    return {
      id: order.id.toString(),
      nftAddr: order.nftAddr,
      nftId: order.nftId.toString(),
      owner: order.owner,
      price: order.price.toString(),
      tokenURI: order.tokenURI,
      createdAt: order.createdAt.toNumber()
    }
  })
}

export const fetchMarketplaceOrders = async () => {
  const getOrderIdsCall = [
    {
      address: getMarketplaceAddress(),
      name: 'getOrderIds' 
    }
  ]
  const [ [ ids ] ] = await multicall(marketplaceABI, getOrderIdsCall)
  const orders = await fetchOrders(ids.map(id=>id.toNumber()).sort())
  return orders
}

export const fetchUserOrders = async(account) => {
  const getOrderIdsCall = [
    {
      address: getMarketplaceAddress(),
      name: 'getUserOrderIds',
      params: [ account ] 
    }
  ]
  const [ [ ids ] ] = await multicall(marketplaceABI, getOrderIdsCall)
  const orders = await fetchOrders(ids.map(id=>id.toNumber()).sort())
  return orders
}

export const fetchNftOrder = async (id: string) => {
  const numberId = new BigNumber(id).toNumber()
  const [ order ] = await fetchOrders([ numberId ])
  return order
}

export const fetchOrderByNft = async(address: string, id: string) => {
  const calls = [
    {
      address: getMarketplaceAddress(),
      name: 'getOrderByNft',
      params: [ address, id ]
    }
  ]
  const [ order ] = await multicall(marketplaceABI, calls)
  return {
    id: order.id.toString(),
    nftAddr: order.nftAddr,
    nftId: order.nftId.toString(),
    owner: order.owner,
    price: order.price.toString(),
    tokenURI: order.tokenURI,
    createdAt: order.createdAt.toNumber()
  }
}

export default fetchMarketplaceOrders

