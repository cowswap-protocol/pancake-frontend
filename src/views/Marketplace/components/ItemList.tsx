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
import { NftOrder, NftItem } from 'state/types'
import ItemCard from './ItemCard'

export interface ItemListProps {
  address: string
  name: string
  symbol: string
  items: NftItem[]
}

const NftGrid = styled.div`
  display: grid;
  grid-gap: 32px;
  grid-template-columns: 1fr;
  padding-bottom: 24px;
  padding-top: 24px;

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


const ItemList: React.FC<ItemListProps> = ({ address, name, symbol, items }) => {
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()

  return (
    items.length > 0 ?
    <NftGrid>
      {items.map((item) =>
        <ItemCard item={item} name={name} symbol={symbol} key={item.id} />
      )}
    </NftGrid>
    : <NoData>No Data</NoData>
  )
}

export default ItemList
