import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Heading, Button, Text } from 'cowswap-uikit'
import { useTranslation } from 'contexts/Localization'
import Page from 'components/layout/Page'
import { useMarketplace } from 'state/hooks'
import OrderList from './components/OrderList'
import Hero from './components/Hero'


const MyNfts = () => {
  const { t } = useTranslation()
  const { orders } = useMarketplace()
  const orderList = Object.values(orders)
  return (
    <Page>
      <Hero activeIndex={3} />
      <Text>Coming Soon ...</Text>
    </Page>
  )
}

export default MyNfts
