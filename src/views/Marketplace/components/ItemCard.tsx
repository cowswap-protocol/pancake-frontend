import BigNumber from 'bignumber.js'
import React, { useState, useEffect } from 'react'
import { Route, useRouteMatch, useLocation } from 'react-router-dom'
import { PromiEvent } from 'web3-core'
import { Contract } from 'web3-eth-contract'
import styled from 'styled-components'
import {
  Card,
  CardBody,
  Heading,
  Tag,
  Button,
  ChevronUpIcon,
  ChevronDownIcon,
  Text,
  CardFooter,
  useModal,
} from 'cowswap-uikit'
import { useFetchNftMeta } from 'state/hooks'
import { useTranslation } from 'contexts/Localization'
import { NftItem } from 'state/types'
import { useErc721Approved } from 'hooks/useAllowance'
import { useCreateOrder } from 'hooks/useMarketplace'
import { useNftApprove } from 'hooks/useApprove'
import { getMarketplaceAddress } from 'utils/addressHelpers'
import useToast from 'hooks/useToast'
import ListModal from './ListModal'


export interface ItemCardProps {
  name: string
  symbol: string
  item: NftItem
}

const ImageWrapper = styled.div`
  border-radius: 4px;
  align-items: center;
  display: flex;
  justify-content: center;
  max-height: 100%;
  max-width: 100%;
  overflow: hidden;
  position: relative;
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 100%;
    height: auto;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    width: 100%;
  }
`

const Image = styled.img`
  border-radius: 4px;
  object-fit: cover;
`

const PriceWrap = styled.div`
  margin-top: 2px;
  display: flex;
  flex-direction
`

const ItemCard: React.FC<ItemCardProps> = ({ name, symbol, item }) => {
  useFetchNftMeta(item.address, item.id, item.tokenURI)

  const [onPresentModal] = useModal(
    <ListModal item={item}/>, false
  )

  return (
    <Card>
      <CardBody>
        <ImageWrapper>
          <Image src={ item.metadata && item.metadata?.image } />
        </ImageWrapper>
        <Text mt="3px" bold color="black" fontSize="16px">{ item.metadata?.name }</Text>
        <Text mb="2px" bold color="black" fontSize="12px">{ symbol }#{ item.id }</Text>
        <Button 
          width="100%" 
          scale="sm" 
          variant="primary" 
          onClick={onPresentModal}
          disabled={item?.listed}
        >
          { item?.listed ? 'Listed' : 'List' } 
        </Button>
      </CardBody>
    </Card>
  )
}

export default ItemCard
