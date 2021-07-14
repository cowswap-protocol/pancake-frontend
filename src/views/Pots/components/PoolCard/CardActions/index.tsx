import BigNumber from 'bignumber.js'
import React from 'react'
import styled from 'styled-components'
import { BIG_ZERO } from 'utils/bigNumber'
import { Flex, Text, Box } from 'cowswap-uikit'
import { useTranslation } from 'contexts/Localization'
import { PoolCategory } from 'config/constants/types'
import { Pot } from 'state/types'
import Balance from 'components/Balance'
import { getFullDisplayBalance, getBalanceNumber, formatNumber } from 'utils/formatBalance'

import ApprovalAction from './ApprovalAction'
import StakeActions from './StakeActions'
import HarvestActions from './HarvestActions'

const InlineText = styled(Text)`
  display: inline;
`

interface CardActionsProps {
  pool: Pot
  stakedBalance: BigNumber
}

const CardActions: React.FC<CardActionsProps> = ({ pool, stakedBalance }) => {
  const { sousId, stakingToken, earningToken, harvest, userData, earningTokenPrice } = pool
  // Pools using native BNB behave differently than pools using a token
  const isBnbPool = false // poolCategory === PoolCategory.BINANCE
  const { t } = useTranslation()
  const allowance = BIG_ZERO // userData?.allowance ? new BigNumber(userData.allowance) : BIG_ZERO
  const stakingTokenBalance = userData?.stakedBalance ? userData.stakedBalance : BIG_ZERO
  const earnings = userData?.pendingRewards ? new BigNumber(userData.pendingRewards) : BIG_ZERO
  const earned = userData?.unclaimRewards ? new BigNumber(userData.unclaimRewards) : BIG_ZERO

  const stakedTokenBalance = getBalanceNumber(stakedBalance, stakingToken.decimals)

  const isStaked = stakedBalance.gt(0)
  const isLoading = !userData

  return (
    <Flex flexDirection="column">
      <Flex flexDirection="column">
        <HarvestActions
          earnings={earnings}
          earningToken={earningToken}
          stakingToken={stakingToken}
          earned = { earned }
          sousId={sousId}
          earningTokenPrice={earningTokenPrice}
          isLoading={isLoading}
        />

        <Box display="inline">
          <InlineText color={isStaked ? 'secondary' : 'textSubtle'} bold fontSize="12px">
            {isStaked ? stakingToken.symbol : t('Traded')}{' '}
          </InlineText>
          <InlineText color={isStaked ? 'textSubtle' : 'secondary'} bold fontSize="12px">
            {isStaked ? t('Traded') : `${stakingToken.symbol}`}
          </InlineText>
        </Box>

        <Balance bold fontSize="20px" decimals={2} value={stakedTokenBalance} />

      </Flex>
    </Flex>
  )
}

export default CardActions
