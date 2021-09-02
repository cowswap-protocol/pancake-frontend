import React from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Text, useMatchBreakpoints } from 'cowswap-uikit'
import { useTranslation } from 'contexts/Localization'
import { useCakeVault } from 'state/hooks'
import { Pot } from 'state/types'
import { BIG_ZERO } from 'utils/bigNumber'
import TokenPairImage from 'components/TokenPairImage'
import TokenImage from 'components/TokenImage'
import CakeVaultTokenPairImage from '../../CakeVaultCard/CakeVaultTokenPairImage'
import BaseCell, { CellContent } from './BaseCell'

interface NameCellProps {
  pool: Pot
}

const StyledCell = styled(BaseCell)`
  flex: 5;
  flex-direction: row;
  padding-left: 12px;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 1 0 150px;
    padding-left: 32px;
  }
`

const NameCell: React.FC<NameCellProps> = ({ pool }) => {
  const { t } = useTranslation()
  const { isXs, isSm } = useMatchBreakpoints()
  const { sousId, stakingToken, earningToken, userData, isFinished } = pool
  const isAutoVault = false
  const {
    userData: { userShares },
  } = useCakeVault()
  const hasVaultShares = userShares && userShares.gt(0)

  const stakingTokenSymbol = stakingToken.symbol
  const earningTokenSymbol = earningToken.symbol

  const stakedBalance = userData?.stakedBalance ? new BigNumber(userData.stakedBalance) : BIG_ZERO
  const isStaked = stakedBalance.gt(0)
  const isManualCakePool = sousId === 0

  const showStakedTag = false // isAutoVault ? hasVaultShares : isStaked

  let title = `${t('Earn')} ${earningTokenSymbol}`
  let subtitle = `${t('Stake')} ${stakingTokenSymbol}`
  const showSubtitle = sousId !== 0 || (sousId === 0 && !isXs && !isSm)

  // if (isAutoVault) {
  //   title = t('Auto CAKE')
  //   subtitle = t('Automatic restaking')
  // } else if (isManualCakePool) {
  //   title = t('Manual CAKE')
  //   subtitle = `${t('Earn')} CAKE ${t('Stake').toLocaleLowerCase()} CAKE`
  // }

  title = t('Mining')
  subtitle = `${t('Trade')} ${stakingToken.symbol} ${t('Earn')} COWB`

  return (
    <StyledCell role="cell">
     
      <TokenImage token={stakingToken} />
      
      <CellContent>
        {showStakedTag && (
          <Text fontSize="12px" bold color={isFinished ? 'failure' : 'secondary'} textTransform="uppercase">
            {t('Staked')}
          </Text>
        )}
        <Text bold={!isXs && !isSm} small={isXs || isSm}>
          {stakingToken.symbol}
        </Text>
        {showSubtitle && (
          <Text fontSize="12px" color="textSubtle">
            {subtitle}
          </Text>
        )}
      </CellContent>
    </StyledCell>
  )
}

export default NameCell
