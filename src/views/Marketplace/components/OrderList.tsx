import React from 'react'
// import orderBy from 'lodash/orderBy'
import { useWeb3React } from '@web3-react/core'
import { Route, useRouteMatch, useLocation, Link } from 'react-router-dom'
import styled from 'styled-components'
// import nfts from 'config/constants/nfts'
import { useAppDispatch } from 'state'
// import { fetchWalletNfts } from 'state/collectibles'
// import NftCard from './NftCard'
// import NftGrid from './NftGrid'
// import BunnySpecialCard from './NftCard/BunnySpecialCard'
// import EasterNftCard from './NftCard/EasterNftCard'
import { NftOrder } from 'state/types'
import OrderCard from './OrderCard'

export interface OrderListProps {
  orders: NftOrder[]
}

const NftGrid = styled.div`
  display: grid;
  grid-gap: 10px;
  grid-template-columns: 1fr;
  padding-bottom: 10px;
  padding-top: 10px;

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-template-columns: repeat(2, 1fr);
  }

  ${({ theme }) => theme.mediaQueries.md} {
    grid-template-columns: repeat(4, 1fr);
  }
`

const NoData = styled.div`
  text-align: center;
  color: #999;
`

/**
 * A map of bunnyIds to special campaigns (NFT distribution)
 * Each NftCard is responsible for checking it's own claim status
 *
 */
// const nftComponents = {
//   hiccup: BunnySpecialCard,
//   bullish: BunnySpecialCard,
//   'easter-storm': EasterNftCard,
//   'easter-flipper': EasterNftCard,
//   'easter-caker': EasterNftCard,
// }


const OrderList: React.FC<OrderListProps> = ({ orders }) => {
  
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()

  // const handleRefresh = () => {
  //   dispatch(fetchWalletNfts(account))
  // }
  
  return (
    orders.length > 0 ?
    <NftGrid>
      {orders.map((order) =>
        <Link to={`/marketplace/order/${order.id}`} key={order.id}>
          <OrderCard order={order} />
        </Link>
      )}
    </NftGrid>
    : <NoData>No Data</NoData>
  )
}

export default OrderList
