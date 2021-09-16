import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState, useEffect } from 'react'
import { Button, Modal, Text, Tag } from 'cowswap-uikit'
import styled from 'styled-components'
import ModalActions from 'components/ModalActions'
import ModalPriceInput from 'components/ModalInput/ModalPriceInput'
import { useTranslation } from 'contexts/Localization'
import { getFullDisplayBalance } from 'utils/formatBalance'
import { NftItem } from 'state/types'
import useToast from 'hooks/useToast'
import { useErc721Approved } from 'hooks/useAllowance'
import { useCreateOrder } from 'hooks/useMarketplace'
import { useNftApproveAll } from 'hooks/useApprove'
import { getMarketplaceAddress } from 'utils/addressHelpers'
import { useGetNftItem } from 'state/hooks'


const Image = styled.img`
  border-radius: 4px;
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 100%;
    height: 300px;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    width: 300px;
    height: auto;
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

const Desc = styled.div`
  margin-top: 15px;
  margin-bottom: 15px;
  color: grey;
  word-break: break-all;
  white-space: break-spaces;
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 100%;
    height: auto;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    max-width: 300px;
    height: auto;
    min-height: 60px;
  }

`

interface ListModalProps {
  onDismiss?: () => void
  item: NftItem
}

const ListModal: React.FC<ListModalProps> = ({ onDismiss, item }) => {
  const [val, setVal] = useState('')
  const { t } = useTranslation()
  const valNumber = new BigNumber(val)
  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      if (e.currentTarget.validity.valid) {
        setVal(e.currentTarget.value.replace(/,/g, '.'))
      }
    },
    [setVal],
  )

  const [listed, setListed] = useState(false)
  const [hasApproved, setHasApproved] = useState(false)

  const freshItem = useGetNftItem(item.address, item.id)

  useEffect(() => {
    setListed(freshItem.listed)
  }, [ freshItem, setListed ])

  const attributes =  useMemo(() => {
    if(item.metadata && item.metadata.attributes) {
      return Object.keys(item.metadata.attributes).map(k => {
        return { key: k, value: item.metadata.attributes[k] }  
      })
    }
    return []
  }, [item] )


  const approved = useErc721Approved(item.address, getMarketplaceAddress(), parseInt(item.id))
  const { toastSuccess, toastError } = useToast()
  const [ pendingTx, setPendingTx ] = useState(false)
  const [ listingTx, setListingTx ] = useState(false)
  const { onApprove } = useNftApproveAll(item.address)
  const { onCreateOrder } = useCreateOrder()

  useEffect(() => {
    setHasApproved(approved)
  }, [ approved ])

  const handlePlaceClick = async () => {
    setListingTx(true)
    try {
      await onCreateOrder(item.address, parseInt(item.id).toString(), val)
      setListed(true)
      toastSuccess(
        `${t('Listed')}!`,
        t('You list your NFT'),
      )
      setListingTx(false)
    } catch (e) {
      toastError(t('Canceled'), t('Please try again and confirm the transaction.'))
      setListingTx(false)
    }
  }

  const handleApproveClick = async () => {
    setPendingTx(true)
    try {
      await onApprove(getMarketplaceAddress())
      await handlePlaceClick()
      setHasApproved(true)
      toastSuccess(
        `${t('Approved')}!`,
        t('You approved NFT'),
      )
      setPendingTx(false)

    } catch (e) {
      toastError(t('Canceled'), t('Please try again and confirm the transaction.'))
      setPendingTx(false)
    }
  }

  

  return (
    <Modal title={t('List')} onDismiss={onDismiss} minWidth="50%">
      <CardContent>
        <Content style={{ textAlign: 'center'}}>
          <Image src={ item.metadata?.image }/>
          <Text mt="5px">
            {
              attributes.map((attr) => {
                return <Tag variant="textSubtle" key={`${attr.key}_${attr.value}`}>{attr.key}: { attr.value }</Tag>
              })
            }
          </Text>
        </Content>
        <Content>
          <Text bold color="black" fontSize="35px"> { item.metadata?.name } </Text>

          <Desc>
            { item.metadata?.description }  
          </Desc>
          <Text mt="15px" color="secondary"> List Price </Text>
          <ModalPriceInput
            onChange={handleChange}
            value={val}
            symbol="BNB"
            inputTitle={t('Price')}
          />
          {
            !hasApproved && !listed ? (
              <Button
                mt="10px"
                disabled={pendingTx}
                onClick={handleApproveClick}
                width="100%"
              >
                {pendingTx ? t('Approving') : t('Approve')}
              </Button>
            ) : (
              <Button
                mt="10px"
                disabled={listingTx || !valNumber.isFinite() || valNumber.eq(0) || listed }
                onClick={handlePlaceClick}
                width="100%"
              >
                {listingTx ? t('Pending Confirmation') : t(listed ? 'Listed' : 'List') }
              </Button>
            )
          }
          
        </Content>
      </CardContent>
    </Modal>
  )
}

export default ListModal
