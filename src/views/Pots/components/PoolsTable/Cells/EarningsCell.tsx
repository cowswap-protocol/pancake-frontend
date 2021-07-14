import React from 'react'
import styled from 'styled-components'
import { Skeleton, Text, useTooltip, HelpIcon, Flex, Box, useModal, useMatchBreakpoints } from 'cowswap-uikit'
import { Pot } from 'state/types'
import BigNumber from 'bignumber.js'
import { PoolCategory } from 'config/constants/types'
import { BIG_ZERO } from 'utils/bigNumber'
import { formatNumber, getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import Balance from 'components/Balance'
import { useCakeVault } from 'state/hooks'
import { useTranslation } from 'contexts/Localization'
import { getCakeVaultEarnings } from 'views/Pools/helpers'
import BaseCell, { CellContent } from './BaseCell'
import CollectModal from '../../PoolCard/Modals/CollectModal'

interface EarningsCellProps {
  pool: Pot
  account: string
  userDataLoaded: boolean
}

const StyledCell = styled(BaseCell)`
  flex: 4.5;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 1 0 120px;
  }
`

const HelpIconWrapper = styled.div`
  align-self: center;
`

const EarningsCell: React.FC<EarningsCellProps> = ({ pool, account, userDataLoaded }) => {
  const { t } = useTranslation()
  const { isXs, isSm } = useMatchBreakpoints()
  const { sousId, earningToken, userData, earningTokenPrice, stakingToken } = pool
  const isManualCakePool = false

  const earnings = userData?.pendingRewards ? new BigNumber(userData.pendingRewards) : BIG_ZERO
  const earned = userData?.unclaimRewards ? new BigNumber(userData.unclaimRewards) : BIG_ZERO
  // These will be reassigned later if its Auto CAKE vault
  const earningTokenBalance = getBalanceNumber(earnings, earningToken.decimals)
  const earningTokenDollarBalance = getBalanceNumber(earnings.multipliedBy(earningTokenPrice), earningToken.decimals)
  const hasEarnings = account && earnings.gt(0)
  const hasEarned = account && earned.gt(0)
  const earnedTokenBalance = getBalanceNumber(earned, earningToken.decimals)
  const formattedBalance = formatNumber(earnedTokenBalance, 3, 3)
  const fullBalance = getFullDisplayBalance(earned, earningToken.decimals)


  // Auto CAKE vault calculations
  // const {
  //   userData: { cakeAtLastUserAction, userShares, lastUserActionTime },
  //   pricePerFullShare,
  // } = useCakeVault()
  // const { hasAutoEarnings, autoCakeToDisplay, autoUsdToDisplay } = getCakeVaultEarnings(
  //   account,
  //   cakeAtLastUserAction,
  //   userShares,
  //   pricePerFullShare,
  //   earningTokenPrice,
  // )

  // const lastActionInMs = lastUserActionTime && parseInt(lastUserActionTime) * 1000
  // const dateTimeLastAction = new Date(lastActionInMs)
  // const dateStringToDisplay = dateTimeLastAction.toLocaleString()

  // const labelText = isAutoVault ? t('Recent CAKE profit') : t('%asset% Earned', { asset: earningToken.symbol })
  // earningTokenBalance = isAutoVault ? autoCakeToDisplay : earningTokenBalance
  // hasEarnings = isAutoVault ? hasAutoEarnings : hasEarnings
  // earningTokenDollarBalance = isAutoVault ? autoUsdToDisplay : earningTokenDollarBalance

  // const { targetRef, tooltip, tooltipVisible } = useTooltip(
  //   <>
  //     <Balance fontSize="16px" value={autoCakeToDisplay} decimals={3} bold unit=" CAKE" />
  //     <Balance fontSize="16px" value={autoUsdToDisplay} decimals={2} bold prefix="~$" />
  //     {t('Earned since your last action')}
  //     <Text>{dateStringToDisplay}</Text>
  //   </>,
  //   { placement: 'bottom' },
  // )

  const [onPresentCollect] = useModal(
    <CollectModal
      formattedBalance={formattedBalance}
      fullBalance={fullBalance}
      earningToken={earningToken}
      earningsDollarValue={earningTokenDollarBalance}
      sousId={sousId}
      stakingToken={stakingToken}
    />,
  )

  const handleEarningsClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    onPresentCollect()
  }

  return (
    <StyledCell role="cell">
      <CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          { t('Today %asset% Earning', { asset: earningToken.symbol }) }
        </Text>
        {!userDataLoaded && account ? (
          <Skeleton width="80px" height="16px" />
        ) : (
          <>
            <Flex>
              <Box mr="8px" height="32px" onClick={hasEarned ? handleEarningsClick : undefined}>
                <Balance
                  mt="4px"
                  bold={!isXs && !isSm}
                  fontSize={isXs || isSm ? '14px' : '16px'}
                  color={hasEarnings ? 'primary' : 'textDisabled'}
                  decimals={hasEarnings ? 0 : 0}
                  value={hasEarnings ? earningTokenBalance : 0}
                />
                {hasEarnings ? (
                  <>
                    {earningTokenPrice > 0 && (
                      <Balance
                        display="inline"
                        fontSize="12px"
                        color="textSubtle"
                        decimals={2}
                        prefix="~"
                        value={earningTokenDollarBalance}
                        unit=" USD"
                      />
                    )}
                  </>
                ) : (
                  <Text mt="4px" fontSize="12px" color="textDisabled">
                    0 USD
                  </Text>
                )}
              </Box>
              {hasEarnings && !isXs && !isSm && (
                <HelpIconWrapper>
                  <HelpIcon color="textSubtle" />
                </HelpIconWrapper>
              )}
            </Flex>
          </>
        )}
      </CellContent>
    </StyledCell>
  )
}

export default EarningsCell
