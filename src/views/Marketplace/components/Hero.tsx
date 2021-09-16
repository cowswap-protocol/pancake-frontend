import React from 'react'
import styled from 'styled-components'
import { Heading, Button, ButtonMenu, ButtonMenuItem, Text } from 'cowswap-uikit'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'contexts/Localization'

const StyledHero = styled.div`
  // border-bottom: 1px solid ${({ theme }) => theme.colors.inputSecondary};
  margin-bottom: 24px;
  // padding-bottom: 32px;
  // display: flex;
  // justify-content: space-between;
`

interface HeroProps {
  activeIndex?: number
}



const Hero: React.FC<HeroProps> = ( { activeIndex }) => {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  return (
    <StyledHero>
      <Heading as="h1" scale="xxl" color="secondary" mb="20px">
        {t('Open NFT Market')}
        <Text>A simple open and free NFT marketplace for anyone</Text>
      </Heading>
      <ButtonMenu activeIndex={activeIndex} >
        <ButtonMenuItem as={Link} to="/marketplace">
          All
        </ButtonMenuItem>
        <ButtonMenuItem as={Link} to="/marketplace/my-orders">
          My Listings
        </ButtonMenuItem>
        <ButtonMenuItem as={Link} to="/marketplace/create">
          List
        </ButtonMenuItem>
        <ButtonMenuItem as={Link} to="/marketplace/my-nfts">
          My NFTs
        </ButtonMenuItem>
      </ButtonMenu>
    </StyledHero>
  )
}

export default Hero