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
import { useProfile } from 'state/hooks'
import { useTranslation } from 'contexts/Localization'
import { NftOrder } from 'state/types'
import { fetchTokenUriData } from 'utils/collectibles'
import { getFullDisplayBalance } from 'utils/formatBalance'


export interface OrderCardProps {
  order: NftOrder
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
    height: 245px;
    min-height: 245px;
  }
`

const Image = styled.img`
  border-radius: 4px;
  object-fit: cover;
`

const BlankImage = styled.div`
  border-radius: 4px;
  background-color: #eee;
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 100%;
    height: auto;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    width: 100%;
    height: auto;
    min-height: 315px;
  }
`

const PriceWrap = styled.div`
  margin-top: 0px;
  display: flex;
  flex-direction
`

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const { t } = useTranslation()
  const { tokenURI, price } = order
  const [ nftMeta, setNftMeta ] = useState<any>({})
  const displayPrice = getFullDisplayBalance(new BigNumber(price))
  useEffect(() => {
    const fetchMeta = async () => {
      const data = await fetchTokenUriData(tokenURI)
      setNftMeta(data)
    }
    fetchMeta()
  }, [tokenURI, setNftMeta])

  return (
    <Card>
      <CardBody style={{ padding: "15px 15px"}}>
        {
          nftMeta ? 
            ( <ImageWrapper>
                <Image src={nftMeta.image} /> 
              </ImageWrapper>
            )
            : <BlankImage />
        }
        
        <Text mt="5px" bold color="black" fontSize="16px">
          { nftMeta && ( nftMeta.name || '--' ) }
        </Text>
        
        <PriceWrap>
          <Text color="grey" mr="5px">Price</Text>
          <Text bold >
            { displayPrice } BNB
          </Text>
        </PriceWrap>
      </CardBody>
    </Card>
  )
}

export default OrderCard
