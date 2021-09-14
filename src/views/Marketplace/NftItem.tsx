import React from 'react'
import styled from 'styled-components'
import { Heading } from 'cowswap-uikit'
import { useTranslation } from 'contexts/Localization'
import { Link, Redirect, useParams } from 'react-router-dom'
import { useNftOrder } from 'state/hooks'
import Page from 'components/layout/Page'
import Hero from './components/Hero'


const NftItem = () => {
  const { id }: { address: string, id: string } = useParams()

  return (
    <Page>
      <Hero activeIndex={0} />
      
    </Page>
  )
}

export default NftItem