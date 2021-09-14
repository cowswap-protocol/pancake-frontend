import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Heading, Button } from 'cowswap-uikit'
import { useTranslation } from 'contexts/Localization'
import Page from 'components/layout/Page'
import { useMarketplace, useUserOrders } from 'state/hooks'
import OrderList from './components/OrderList'
import Hero from './components/Hero'


const MyOrders = () => {
  const { t } = useTranslation()
  const { userOrders } = useUserOrders()
  const orderList = Object.values(userOrders)
  return (
    <Page>
      <Hero activeIndex={1} />
      <OrderList orders={orderList} />
    </Page>
  )
}

export default MyOrders
