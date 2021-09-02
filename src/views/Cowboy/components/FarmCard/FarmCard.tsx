import React, { useState } from 'react'
import BigNumber from 'bignumber.js'
import styled, { keyframes } from 'styled-components'
import { Flex, Text, Skeleton, CardBody, CardFooter } from 'cowswap-uikit'
import { Cowboy } from 'state/types'
import { getBscScanAddressUrl } from 'utils/bscscan'
import { useTranslation } from 'contexts/Localization'
import ExpandableSectionButton from 'components/ExpandableSectionButton'
import { BASE_URL } from 'config'
import { getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import Balance from 'components/Balance'
import DetailsSection from './DetailsSection'
import CardHeading from './CardHeading'
import CardActionsContainer from './CardActionsContainer'
import ApyButton from './ApyButton'
import { StyledCard, StyledCardInner } from './StyledCard'

// export interface FarmWithStakedValue extends Farm {
//   apr?: number
//   liquidity?: BigNumber
// }

// const AccentGradient = keyframes`  
//   0% {
//     background-position: 50% 0%;
//   }
//   50% {
//     background-position: 50% 100%;
//   }
//   100% {
//     background-position: 50% 0%;
//   }
// `

// const StyledCardAccent = styled.div`
//   background: ${({ theme }) => `linear-gradient(180deg, ${theme.colors.primaryBright}, ${theme.colors.secondary})`};
//   background-size: 400% 400%;
//   animation: ${AccentGradient} 2s linear infinite;
//   border-radius: 32px;
//   position: absolute;
//   top: -1px;
//   right: -1px;
//   bottom: -3px;
//   left: -1px;
//   z-index: -1;
// `

// const FCard = styled.div<{ isPromotedFarm: boolean }>`
//   align-self: baseline;
//   background: ${(props) => props.theme.card.background};
//   border-radius: ${({ theme, isPromotedFarm }) => (isPromotedFarm ? '31px' : theme.radii.card)};
//   box-shadow: 0px 1px 4px rgba(25, 19, 38, 0.15);
//   display: flex;
//   flex-direction: column;
//   justify-content: space-around;
//   padding: 24px;
//   position: relative;
//   text-align: center;
// `

const Divider = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBorder};
  height: 1px;
  margin: 28px auto;
  width: 100%;
`

const ExpandingWrapper = styled.div<{ expanded: boolean }>`
  height: ${(props) => (props.expanded ? '100%' : '0px')};
  overflow: hidden;
`

interface FarmCardProps {
  farm: Cowboy
  removed: boolean
  cakePrice?: BigNumber
  account?: string
}

const FarmCard: React.FC<FarmCardProps> = ({ farm, removed, cakePrice, account }) => {
  const { t } = useTranslation()

  // const [showExpandableSection, setShowExpandableSection] = useState(false)

  const convertRate = farm.price ? getFullDisplayBalance(new BigNumber(farm.price), 0, 8) : '--'

  const farmAPR = farm.apr && farm.apr.toLocaleString('en-US', { maximumFractionDigits: 2 })

  const addLiquidityUrl = `${BASE_URL}`

  const totalStaked = new BigNumber(farm.totalStaked)

  return (
    <StyledCard isPromoted={{ isDesktop: true }} isFinished={false}>
      <StyledCardInner>
         <CardHeading />
        <CardBody>
          <Flex justifyContent="space-between" alignItems="center">
            <Text>{t('APR')}:</Text>
            <Text bold style={{ display: 'flex', alignItems: 'center' }}>
              {farm.apr ? (
                <>
                  {farmAPR}%
                </>
              ) : (
                <Skeleton height={24} width={80} />
              )}
            </Text>
          </Flex>

          <Flex mt="10px">
            <Text>1 COWBOY = { convertRate } COWB</Text>
          </Flex>
          <CardActionsContainer cowboy={farm} account={account}  />

        </CardBody>
        <CardFooter>
          <Flex mb="2px" justifyContent="space-between" alignItems="center">
          <Text>{t('Total staked')}:</Text>
          <Flex alignItems="flex-start">
            {totalStaked && totalStaked.gte(0) ? (
              <Balance small value={getBalanceNumber(totalStaked, 0)} decimals={0} unit=" COWB" />
            ) : (
              <Skeleton width="90px" height="21px" />
            )}
          </Flex>
        </Flex>
        </CardFooter>
      </StyledCardInner>
    </StyledCard>
  )
}

export default FarmCard
