import React from 'react'
import { useTranslation } from 'contexts/Localization'
import { Route, useRouteMatch, Link } from 'react-router-dom'
import { ButtonMenu, ButtonMenuItem, Flex, Text } from 'cowswap-uikit'
import Container from 'components/layout/Container'
import FlexLayout from 'components/layout/Flex'
import { useWeb3React } from '@web3-react/core'
import { usePriceCakeBusd, useFarms, useCowboy, usePollCowboyData } from 'state/hooks'

import Hero from './Hero'
import FarmCard from './components/FarmCard/FarmCard'


const Cowboy = () => {
  const { t } = useTranslation()
  const cakePrice = usePriceCakeBusd()
  const { account } = useWeb3React()
  
  const { data: cowboy, userDataLoaded: cowboyLoaded } = useCowboy(account)

  usePollCowboyData()
  return (
    <>
      <Hero />
      <FlexLayout>
        <FarmCard 
          key="cowboy" 
          farm={cowboy} 
          cakePrice={cakePrice} 
          account={account} 
          removed={false} 
        />
      </FlexLayout>
    </>
  )
}

export default Cowboy
