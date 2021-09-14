import BigNumber from 'bignumber.js'
import React, { useState, useEffect, useMemo } from 'react'
import { Route, useRouteMatch, useLocation, Link } from 'react-router-dom'
import { PromiEvent } from 'web3-core'
import { Contract } from 'web3-eth-contract'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
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
  ArrowBackIcon,
  AutoRenewIcon
} from 'cowswap-uikit'
import { useProfile } from 'state/hooks'
import { useTranslation } from 'contexts/Localization'
import { NftOrder } from 'state/types'
import { fetchTokenUriData } from 'utils/collectibles'
import { getFullDisplayBalance } from 'utils/formatBalance'
import { useCancelOrder, useBuy, useChangePrice } from 'hooks/useMarketplace'
import useToast from 'hooks/useToast'
import ChangePriceModal from './ChangePriceModal'

export interface OrderCardProps {
  order: NftOrder
}

const Image = styled.img`
  width: 360px;
  border-radius: 4px;
  margin-right: 30px;
`
const BlankImage = styled.div`
  width: 360px;
  border-radius: 4px;
  margin-right: 30px;
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

const CardContent = styled.div`
  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: column;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    display: flex;
    flex-direction: row;
  }
  margin-bottom: 20px;
`
const Content = styled.div`
  padding: 10px;
  width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
`

const StyledCardContent = styled.div`
  align-items: start;
  display: flex;
`

const NftInfo = styled.div`
  border-top: 1px solid #eee;
  margin-top: 50px;
  padding: 10px 0;
`

const NftProperties = styled.div`
  margin-top: 20px;
`


const OrderDetail: React.FC<OrderCardProps> = ({ order }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { tokenURI, price } = order
  const [ nftMeta, setNftMeta ] = useState<any>({})
  const displayPrice = getFullDisplayBalance(new BigNumber(price))
  const [isMyOrder, setIsMyOrder] = useState(false)

  useMemo(() => {
    if(account && order.owner.toLowerCase() === account.toLowerCase()) {
      setIsMyOrder(true)
    }
  },[ account, setIsMyOrder, order])

  useEffect(() => {
    const fetchMeta = async () => {
      const data = await fetchTokenUriData(tokenURI)
      setNftMeta(data)
    }
    fetchMeta()
  }, [tokenURI, setNftMeta])

  const { toastSuccess, toastError } = useToast()
  const [pendingTx, setPendingTx] = useState(false)
  const [canceled, setCanceled] = useState(false)
  const [bought, setBought] = useState(false)
  const [isChangingPrice, setIsChangingPrice ] = useState(false)
  const { onCancelOrder } = useCancelOrder()
  const { onBuy } = useBuy()
  const { onChangePrice } = useChangePrice()


  const handleCancelClick = async () => {
    setPendingTx(true)
    try {
      await onCancelOrder(order.id)
      setCanceled(true)
      toastSuccess(
        `${t('Canceled')}!`,
        t('You canceled order'),
      )
      setPendingTx(false)
    } catch (e) {
      console.log("error=", e)
      toastError(t('Canceled'), t('Please try again and confirm the transaction.'))
      setPendingTx(false)
    }
  }

  const handleBuyClick = async () => {
    setPendingTx(true)
    try {
      await onBuy(order.id, displayPrice)
      setBought(true)
      toastSuccess(
        `${t('Complete')}!`,
        t('You bought the NFT'),
      )
      setPendingTx(false)
    } catch (e) {
      toastError(t('Canceled'), t('Please try again and confirm the transaction.'))
      setPendingTx(false)
    }
  }

  const handleChangePrice = async (newPrice) => {
    setIsChangingPrice(true)
    try {
      await onChangePrice(order.id, newPrice)
      setIsChangingPrice(false)
    } catch (e) {
      console.log("error=", e)
      toastError(t('Canceled'), t('Please try again and confirm the transaction.'))
      setIsChangingPrice(false)
    }
  }

  const [onPresentModal] = useModal(
    <ChangePriceModal defaultValue={displayPrice} onConfirm={handleChangePrice} tokenName="BNB" />,
  )

  return (
    <Card>
      <CardBody>
        
        <CardContent>
          <Content style={{ textAlign: 'center' }}>
            {
              nftMeta ?
              <Image src={ nftMeta.image} />
              : <BlankImage /> 
            }

            {
              nftMeta && nftMeta.attributes ? 
              <NftProperties>
              {
                nftMeta.attributes.map((attr) => {
                  return <Tag variant="textSubtle" key={`${attr.trait_type}_${attr.value}`}>{attr.trait_type}: { attr.value }</Tag>
                })
              }
              </NftProperties>
              : null
            }
          </Content>
          <Content>
            <Text bold color="black" fontSize="35px">{ nftMeta && (nftMeta.name || '--') }</Text>
            <Text>Owner: {order.owner}</Text>
            <Text mt="15px" color="gray" >
              { nftMeta && nftMeta.description }
            </Text>
            <Text mt="15px" color="secondary"> Price </Text>
            <Text bold fontSize="20px">
              { displayPrice } BNB

              {
                isMyOrder && (<Button 
                  ml="10px"
                  scale="xs" 
                  variant="secondary"
                  onClick={onPresentModal}
                  isLoading={isChangingPrice}
                >
                  Change
                </Button>)
              }
            </Text>
            {
              isMyOrder ? (
                <Button 
                  variant="danger" 
                  mt="20px"
                  disabled={canceled}
                  isLoading={pendingTx}
                  onClick={handleCancelClick}
                  endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
                >
                  { canceled ? 'Canceled' : 'Cancel' }
                </Button>
              ) : (
                !bought && <Button 
                  variant="primary" 
                  mt="20px"
                  isLoading={pendingTx}
                  onClick={handleBuyClick}
                  endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
                >
                  Buy Now
                </Button>
              )
            }

            <NftInfo>
              <Text mt="5px">Contract: { order.nftAddr }</Text>
              <Text mt="5px">TokenId: { order.nftId }</Text>
            </NftInfo>

            
          </Content>
        </CardContent>
      </CardBody>
    </Card>
  )
}

export default OrderDetail
