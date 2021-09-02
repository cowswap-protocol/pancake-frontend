import React from 'react'
import styled from 'styled-components'
import { Box, Heading, Text } from 'cowswap-uikit'
import Container from 'components/layout/Container'
import PageHeader from 'components/PageHeader'
import { useTranslation } from 'contexts/Localization'

const getGradient = (isDark: boolean) => {
  if (isDark) {
    return 'repeating-linear-gradient(to right, #332453, #332453 40px, #281D44 40px, #281D44 80px)'
  }

  return 'repeating-linear-gradient(to right, #21d4e2, #21d4e2 40px, #53dee9 40px, #53dee9 80px)'
}

const StyledHero = styled.div`
  background-image: linear-gradient(#7645d9, #452a7a);
  // background: ${({ theme }) => getGradient(theme.isDark)};
  padding-bottom: 40px;
  padding-top: 40px;
`

const CurtainBottom = styled.div`
  background-repeat: repeat-x;
  background-size: contain;
  height: 20px;
`

const Hero = () => {
  const { t } = useTranslation()

  return (
    <Box mb="32px">
      <PageHeader>
        <Container>
          <Heading as="h1" scale="xl" mb="24px">
            {t('Maximize yield by staking CowBaby for CowBoy')}
          </Heading>
          <Text bold fontSize="20px">
            {t('When your COWB is staked into the CowBoy, you receive COWBOY token in return. Your COWBOY token is continuously compounding, when you unstake you will receive all the originally deposited COWB and additional rewards.')}
          </Text>
        </Container>
      </PageHeader>
      <CurtainBottom />
    </Box>
  )
}

export default Hero
