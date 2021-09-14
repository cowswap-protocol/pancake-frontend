import React from 'react'
import styled from 'styled-components'
import { Heading } from 'cowswap-uikit'
import { useTranslation } from 'contexts/Localization'
import { Link, Redirect, useParams } from 'react-router-dom'
import { useNftOrder } from 'state/hooks'
import Page from 'components/layout/Page'
import OrderDetail from './components/OrderDetail'
import Hero from './components/Hero'


const Order = () => {
  const { id }: { id: string } = useParams()
  const order = useNftOrder(id)
  const { t } = useTranslation()
  return (
    <Page>
      <Hero activeIndex={10} />
      {
        order ? <OrderDetail order={order} /> : null
      }
      
    </Page>
  )
}

export default Order