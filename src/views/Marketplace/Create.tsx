import React, { useState, useCallback, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'

import { 
  Heading,
  Card,
  CardBody,
  Tag,
  Button,
  ArrowBackIcon,
  Text,
  CardFooter,
  Input,
  Skeleton,
  AutoRenewIcon,
  Message
} from 'cowswap-uikit'
import { useTranslation } from 'contexts/Localization'
import { Link, Redirect, useParams } from 'react-router-dom'
import { useNftOrder } from 'state/hooks'
import { useErc721Approved } from 'hooks/useAllowance'
import { useCreateOrder } from 'hooks/useMarketplace'
import { useNftApprove } from 'hooks/useApprove'
import { fetchTokenUriData, getTokenUriData, fetchNft } from 'utils/collectibles'
import { getMarketplaceAddress } from 'utils/addressHelpers'
import useToast from 'hooks/useToast'
import Page from 'components/layout/Page'
import OrderDetail from './components/OrderDetail'
import Hero from './components/Hero'

const Image = styled.img`
  height: 400px;
  border-radius: 4px;
  margin-right: 30px;
`
const SkeletonWrapper = styled.div`
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 100%;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    width: 400px;
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
`

const Content = styled.div`
  padding: 10px;
  width: 100%;
`

const NftInfo = styled.div`
  border-top: 1px solid #eee;
  margin-top: 50px;
  padding: 10px 0;
`

const NftProperties = styled.div`
  margin-top: 20px;
`

const CreateOrder = () => {
  const { t } = useTranslation()
  const [ nftInfo, setNftInfo ] = useState<any>(null)
  const [inputAddress, setInputAddress] = useState('')
  const [inputTokenId, setInputTokenId] = useState('')
  const [inputPrice, setInputPrice] = useState('')
  const [ error, setError ] = useState('')
  const { account } = useWeb3React()
  const [ listed, setListed ] = useState(false)

  const handleAddressChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      if (e.currentTarget.validity.valid) {
        setInputAddress(e.currentTarget.value)
        setError('')
      } else {
        setError("Invalid contract address")
      }
    },
    [setInputAddress, setError],
  )

  const handleTokenIdChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      if (e.currentTarget.validity.valid) {
        setInputTokenId(e.currentTarget.value.replace(/\./g, ''))
        setError('')
      } else {
        setError('Input TokenId')
      }
    },
    [setInputTokenId, setError],
  )

  const handlePriceChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      
      if (e.currentTarget.validity.valid) {
        setInputPrice(e.currentTarget.value)
        const v = parseFloat(e.currentTarget.value)
        setError('')
        if(!v) {
          setError('Input Price')  
        }
      } else {
        setError('Input Price')
      }
    },
    [setInputPrice, setError],
  )

  useEffect(() => {
    const fetchNftInfo = async () => {
      const data = await fetchNft(inputAddress, parseInt(inputTokenId))
      setNftInfo(data)
      if(data) {
        if(data.owner === getMarketplaceAddress()) {
          setError('Listed')
          setListed(true)
        } else if(data.owner !== account) {
          setError('Not owner')
        } else {
          setError('')
        }
      } else {
        setError('')
      }
    }
    if(inputAddress && inputTokenId) {
      fetchNftInfo()  
    }
  }, [setNftInfo, inputAddress, inputTokenId, setError, account])

  const isValid = useMemo(() => {
    if(inputAddress && inputTokenId && inputPrice) {
      return true
    }
    return false
  }, [inputAddress, inputTokenId, inputPrice])

  const approved = useErc721Approved(inputAddress, getMarketplaceAddress(), parseInt(inputTokenId))
  const { toastSuccess, toastError } = useToast()
  const [ pendingTx, setPendingTx ] = useState(false)
  const [ pendingPlaceTx, setPendingPlaceTx ] = useState(false)
  const { onApprove } = useNftApprove(inputAddress)
  const { onCreateOrder } = useCreateOrder()

  const handleApproveClick = async () => {
    setPendingTx(true)
    try {
      await onApprove(getMarketplaceAddress(), parseInt(inputTokenId))
      toastSuccess(
        `${t('Approved')}!`,
        t('You approved NFT'),
      )
      setPendingTx(false)
    } catch (e) {
      console.log("error=", e)
      toastError(t('Canceled'), t('Please try again and confirm the transaction.'))
      setPendingTx(false)
    }
  }

  const handlePlaceClick = async () => {
    setPendingPlaceTx(true)
    try {
      await onCreateOrder(inputAddress, parseInt(inputTokenId).toString(), inputPrice)
      setListed(true)
      toastSuccess(
        `${t('Placed')}!`,
        t('You Create an order for your NFT'),
      )
      setPendingPlaceTx(false)
    } catch (e) {
      toastError(t('Canceled'), t('Please try again and confirm the transaction.'))
      setPendingPlaceTx(false)
    }
  }

  return (
    <Page>
      <Hero activeIndex={2}/>
      <Card>

        <CardBody>
          <Heading mb="15px">
            Create Order
          </Heading>
          <CardContent>
            <Content>
              {
                nftInfo ? (
                  <>
                  <Text>
                    <Image src={nftInfo.uriMeta.image} />
                  </Text>
                  <Text bold color="black" fontSize="35px">{ nftInfo.uriMeta.name }</Text>
              
                  <Text mt="15px" color="gray" >
                    { nftInfo.uriMeta.description }
                  </Text>

                  {
                    nftInfo.uriMeta && nftInfo.uriMeta.attributes ? 
                    <NftProperties>
                    {
                      nftInfo.uriMeta.attributes.map((attr) => {
                        return <Tag variant="textSubtle" key={`attr_${attr.trait_type}`}>{attr.trait_type}: { attr.value }</Tag>
                      })
                    }
                    </NftProperties>
                    : null
                  }
                  </>
                ) : (
                  <SkeletonWrapper>
                    <Skeleton height={300} />
                    <Skeleton width={100}  mt="10px" />
                    <Skeleton mt="10px" />
                    <Skeleton width={200}  mt="10px" />
                  </SkeletonWrapper>
                )
              }
            </Content>
            <Content>
              
              <Text>
                <Text>Contract Address: </Text>
                <Input 
                  type="text"
                  pattern="^0x[0-9a-fA-F]{40}$"
                  scale="lg" 
                  placeholder="0x"
                  value={inputAddress}
                  onChange={handleAddressChange}
                />
              </Text>
              <Text mt="10px">
                <Text>TokenId: </Text>
                <Input 
                  type="number" 
                  scale="lg" 
                  placeholder=""
                  value={inputTokenId}
                  onChange={handleTokenIdChange}
                />
              </Text>
              <Text mt="10px">
                <Text>BNB Price: </Text>
                <Input 
                  type="text" 
                  scale="lg" 
                  value={inputPrice}
                  onChange={handlePriceChange}
                />
              </Text>

              <Text mt="10px">
                {
                  !approved && isValid && !pendingPlaceTx ? 
                    <Button 
                      disabled={ error !== '' || listed }
                      onClick={handleApproveClick}
                      isLoading={pendingTx}
                      endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
                    > 
                    { listed ? 'Listed' : ( error || 'Approve' ) } 
                    </Button> 
                    : 
                    <Button 
                      disabled={ !isValid || error !== '' }
                      onClick={handlePlaceClick}
                      isLoading={pendingPlaceTx}
                      endIcon={pendingPlaceTx ? <AutoRenewIcon spin color="currentColor" /> : null}
                    > 
                      { listed ? 'Listed' : ( error || 'Place' ) }
                    </Button>
                }
                
              </Text>
            </Content>
          </CardContent>
        </CardBody>
      </Card>
    </Page>
  )
}

export default CreateOrder