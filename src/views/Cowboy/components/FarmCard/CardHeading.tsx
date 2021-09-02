import React from 'react'
import styled from 'styled-components'
import { Tag, Flex, Heading, CowboyIcon, Text, CardHeader } from 'cowswap-uikit'
import { CommunityTag, CoreTag } from 'components/Tags'
import { Token } from 'config/constants/types'
import TokenPairImage from 'components/TokenPairImage'

const Wrapper = styled(CardHeader)<{ isFinished?: boolean; background?: string }>`
  background: ${({ isFinished, background, theme }) =>
    isFinished ? theme.colors.backgroundDisabled : theme.colors.gradients[background]};
  border-radius: ${({ theme }) => `${theme.radii.card} ${theme.radii.card} 0 0`};
`

const CardHeading  = () => {

  const background = 'bubblegum' //  'bubblegum' / 'cardHeader'

  return (
    <Wrapper isFinished={false} background={background}>
      <Flex alignItems="center" justifyContent="space-between">
        <Flex flexDirection="column">
          <Heading color="body" scale="lg">
            Cowboy
          </Heading>
          <Text color="textSubtle">Automatic compounding COWB </Text>
        </Flex>
        <CowboyIcon width="52px"/>
      </Flex>
    </Wrapper>
  )
}

export default CardHeading
