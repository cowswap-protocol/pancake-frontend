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
import { useNftOrder, useUserSearch } from 'state/hooks'
import { useErc721Approved } from 'hooks/useAllowance'
import { useCreateOrder } from 'hooks/useMarketplace'
import { useNftApprove } from 'hooks/useApprove'
import { fetchTokenUriData, getTokenUriData, fetchNft } from 'utils/collectibles'
import { getMarketplaceAddress } from 'utils/addressHelpers'
import useToast from 'hooks/useToast'
import Page from 'components/layout/Page'
import OrderDetail from './components/OrderDetail'
import Hero from './components/Hero'
import ItemList from './components/ItemList'


const Search = styled.div`
  
`

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

const Sell = () => {
  const { t } = useTranslation()
  const [inputAddress, setInputAddress] = useState('')
  const { userSearch } = useUserSearch(inputAddress, 0)
  const [ error, setError ] = useState('')
  const handleAddressChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setInputAddress(e.currentTarget.value) 
      if (!e.currentTarget.validity.valid) {
        setError("Invalid Address")
      } else if(e.currentTarget.value === '') {
        setError('')
      }
    },
    [setInputAddress, setError],
  )

  return (
    <Page>
      <Hero activeIndex={2}/>
      <Search>
        <Heading mb="15px">
          List your NFTs
        </Heading>
        <Text>
          <Input
            type="text"
            pattern="^0x[0-9a-fA-F]{40}$"
            scale="lg" 
            placeholder="BEP721/ERC721 Contract Address"
            value={inputAddress}
            onChange={handleAddressChange}
            maxLength={42}
          />
        </Text>
      </Search>
      {
        userSearch.items.length > 0 ? 
        (
          <>
          <Text mt="5px" color="success">You own { userSearch.itemsTotalLength } { userSearch.symbol } </Text>
          <ItemList {...userSearch} />
          </>
        ) 
        : 
        ( 
          <Text mt="20px" color="grey">
            {
              userSearch.isLoading ? 
              <AutoRenewIcon spin />
              : (error || userSearch.error || "No Item")
            }
          </Text>
        )
      }

    </Page>
  )
}

export default Sell