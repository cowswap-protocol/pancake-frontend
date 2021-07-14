import React from 'react'
import { useTranslation } from 'contexts/Localization'
import { Route, useRouteMatch, Link } from 'react-router-dom'
import { ButtonMenu, ButtonMenuItem, Flex, Text } from 'cowswap-uikit'
import Container from 'components/layout/Container'
import Hero from './Hero'

const Ifos = () => {
  const { t } = useTranslation()
  const { path, url, isExact } = useRouteMatch()

  return (
    <>
      <Hero />
      <Container>
        <Text>...</Text>
      </Container>
    </>
  )
}

export default Ifos
