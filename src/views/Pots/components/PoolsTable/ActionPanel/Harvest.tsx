import React, { useState } from 'react'
import { Button, Text, useModal, Flex, TooltipText, useTooltip, Skeleton, Heading, AutoRenewIcon } from 'cowswap-uikit'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { getCakeVaultEarnings } from 'views/Pools/helpers'
import { PoolCategory } from 'config/constants/types'
import { formatNumber, getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import { useTranslation } from 'contexts/Localization'
import Balance from 'components/Balance'
import { useCakeVault } from 'state/hooks'
import { BIG_ZERO } from 'utils/bigNumber'
import { Pot } from 'state/types'
import useToast from 'hooks/useToast'
import { useClaim } from 'hooks/useHarvest'
import { getAddress } from 'utils/addressHelpers'

import { ActionContainer, ActionTitles, ActionContent } from './styles'
import CollectModal from '../../PoolCard/Modals/CollectModal'
import UnstakingFeeCountdownRow from '../../CakeVaultCard/UnstakingFeeCountdownRow'

interface HarvestActionProps extends Pot {
  userDataLoaded: boolean
}

const HarvestAction: React.FunctionComponent<HarvestActionProps> = ({
  sousId,
  earningToken,
  userData,
  userDataLoaded,
  earningTokenPrice,
  stakingToken
}) => {
  const isAutoVault = false
  const { t } = useTranslation()
  const { account } = useWeb3React()

  const earnings = userData?.pendingRewards ? new BigNumber(userData.pendingRewards) : BIG_ZERO
  const earned = userData?.unclaimRewards ? new BigNumber(userData.unclaimRewards) : BIG_ZERO
  // These will be reassigned later if its Auto CAKE vault
  const earningTokenBalance = getBalanceNumber(earnings, earningToken.decimals)
  const earningTokenDollarBalance = getBalanceNumber(earnings.multipliedBy(earningTokenPrice), earningToken.decimals)

  const earnedTokenBalance = getBalanceNumber(earned, earningToken.decimals)
  const earnedTokenDollarBalance = getBalanceNumber(earned.multipliedBy(earningTokenPrice), earningToken.decimals)

  const hasEarnings = earnings.gt(0)
  const hasEarned = earned.gt(0)
  const fullBalance = getFullDisplayBalance(earnings, earningToken.decimals)
  const formattedBalance = formatNumber(earnedTokenBalance, 0, 0)
  // const isCompoundPool = sousId === 0
  // const isBnbPool = false // poolCategory === PoolCategory.BINANCE

  // Auto CAKE vault calculations
  // const {
  //   userData: { cakeAtLastUserAction, userShares },
  //   pricePerFullShare,
  //   fees: { performanceFee },
  // } = useCakeVault()
  // const { hasAutoEarnings, autoCakeToDisplay, autoUsdToDisplay } = getCakeVaultEarnings(
  //   account,
  //   cakeAtLastUserAction,
  //   userShares,
  //   pricePerFullShare,
  //   earningTokenPrice,
  // )

  // earningTokenBalance = isAutoVault ? autoCakeToDisplay : earningTokenBalance
  // hasEarnings = isAutoVault ? hasAutoEarnings : hasEarnings
  // earningTokenDollarBalance = isAutoVault ? autoUsdToDisplay : earningTokenDollarBalance

  const { onReward } = useClaim(getAddress(stakingToken.address))
  const { toastSuccess, toastError } = useToast()
  const [pendingTx, setPendingTx] = useState(false)
  const handleHarvest = async () => {
    setPendingTx(true)
    try {
      await onReward()
      toastSuccess(
        `${t('Harvested')}!`,
        t('Your %symbol% earnings have been sent to your wallet!', { symbol: earningToken.symbol }),
      )
      setPendingTx(false)
    } catch (e) {
      toastError(t('Canceled'), t('Please try again and confirm the transaction.'))
      setPendingTx(false)
    }
  }
  
  // const [onPresentCollect] = useModal(
  //   <CollectModal
  //     formattedBalance={formattedBalance}
  //     fullBalance={fullBalance}
  //     earningToken={earningToken}
  //     earningsDollarValue={earningTokenDollarBalance}
  //     stakingToken={stakingToken}
  //     sousId={sousId}
  //   />,
  // )

  // const { targetRef, tooltip, tooltipVisible } = useTooltip(
  //   t('Subtracted automatically from each yield harvest and burned.'),
  //   { placement: 'bottom-start' },
  // )

  // const actionTitle = isAutoVault ? (
  //   <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
  //     {t('Recent CAKE profit')}
  //   </Text>
  // ) : (
  //   <>
  //     <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
  //       Today {earningToken.symbol}{' '}
  //     </Text>
  //     <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
  //       {t('Earned')}
  //     </Text>
  //   </>
  // )

  if (!account) {
    return (
      <ActionContainer>
        <ActionTitles>{ t('Today COWB Earned') }</ActionTitles>
        <ActionContent>
          <Balance pt="8px" lineHeight="1" bold fontSize="20px" decimals={5} value={0} />
          <Button disabled>{t('Claim')}</Button>
        </ActionContent>
      </ActionContainer>
    )
  }

  if (!userDataLoaded) {
    return (
      <ActionContainer>
        <ActionTitles >{ t('Today COWB Earned') }</ActionTitles>
        <ActionContent>
          <Skeleton width={180} height="32px" marginTop={14} />
        </ActionContent>
      </ActionContainer>
    )
  }

  return (
    <ActionContainer>
      
      <ActionContent>

        <Flex flex="1" pt="16px" flexDirection="column" alignSelf="flex-start">
          <ActionTitles>{ t('Today COWB Earning') }</ActionTitles>
          <>
            {hasEarnings ? (
              <>
                <Balance lineHeight="1" bold  fontSize="20px" decimals={0} value={earningTokenBalance} />
                {earningTokenPrice > 0 && (
                  <Balance
                    display="inline"
                    fontSize="12px"
                    color="textDisabled"
                    decimals={2}
                    prefix="~"
                    value={earningTokenDollarBalance}
                    unit=" USD"
                  />
                )}
              </>
            ) : (
              <>
                <Heading color="textDisabled">0</Heading>
                <Text fontSize="12px" color="textDisabled">
                  0 USD
                </Text>
              </>
            )}
          </>
        </Flex>

        <Flex flex="1" pt="16px" flexDirection="column" alignSelf="flex-start">
          <ActionTitles>{ t('Collectable COWB Earned') }</ActionTitles>
          <>
            {hasEarned ? (
              <>
                <Balance lineHeight="1" bold fontSize="20px" decimals={0} value={earnedTokenBalance} />
                {earningTokenPrice > 0 && (
                  <Balance
                    display="inline"
                    fontSize="12px"
                    color="textSubtle"
                    decimals={2}
                    prefix="~"
                    value={earnedTokenDollarBalance}
                    unit=" USD"
                  />
                )}
              </>
            ) : (
              <>
                <Heading color="textDisabled">0</Heading>
                <Text fontSize="12px" color="textDisabled">
                  0 USD
                </Text>
              </>
            )}
          </>
        </Flex>

        <Button 
          disabled={!hasEarned} 
          onClick={handleHarvest}
          isLoading={pendingTx}
          endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
        >
          { t('Collect') }
        </Button>
      </ActionContent>
    </ActionContainer>
  )
}

export default HarvestAction
