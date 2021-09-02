import React, { useState } from 'react'
import { Flex, Text, Button, Heading, useModal, Skeleton, Box, AutoRenewIcon } from 'cowswap-uikit'
import BigNumber from 'bignumber.js'
import { Token } from 'config/constants/types'
import { useTranslation } from 'contexts/Localization'
import { getFullDisplayBalance, getBalanceNumber, formatNumber } from 'utils/formatBalance'
import Balance from 'components/Balance'
import useToast from 'hooks/useToast'
import { useClaim } from 'hooks/useHarvest'
import { getAddress } from 'utils/addressHelpers'
import CollectModal from '../Modals/CollectModal'

interface HarvestActionsProps {
  earnings: BigNumber
  earningToken: Token
  stakingToken: Token
  earned: BigNumber
  sousId: number
  earningTokenPrice: number
  isLoading?: boolean
}

const HarvestActions: React.FC<HarvestActionsProps> = ({
  earnings,
  earningToken,
  stakingToken,
  earned,
  sousId,
  earningTokenPrice,
  isLoading = false,
}) => {
  const { t } = useTranslation()
  const earningTokenBalance = getBalanceNumber(earnings, earningToken.decimals)
  const earnedTokenBalance = getBalanceNumber(earned, earningToken.decimals)
  const formattedBalance = formatNumber(earnedTokenBalance, 0, 0)
  const earningTokenDollarBalance = getBalanceNumber(earnings.multipliedBy(earningTokenPrice), earningToken.decimals)

  const fullBalance = getFullDisplayBalance(earned, earningToken.decimals)
  const hasEarnings = earnings.toNumber() >= 0
  const hasEarned = earned.gt(0)


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

  return (
    <>
    <Flex justifyContent="space-between" alignItems="center" mb="16px">
      <Flex flexDirection="column">
        {isLoading ? (
          <Skeleton width="80px" height="48px" />
        ) : (
          <>
            {hasEarnings ? (
              <>
                <Box display="inline">
                  <Text color="secondary" bold fontSize="12px"> 
                    COWB Earned Today
                   </Text>
                </Box>
                <Balance bold fontSize="20px" decimals={0} value={earningTokenBalance} />
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
              <>
                <Heading color="textDisabled">0</Heading>
                <Text fontSize="12px" color="textDisabled">
                  0 USD
                </Text>
              </>
            )}
          </>
        )}
      </Flex>
    </Flex>
    <Flex justifyContent="space-between" alignItems="center" mb="16px">
      <Flex flexDirection="column">
        {isLoading ? (
          <Skeleton width="80px" height="48px" />
        ) : (
          <>
            {hasEarned ? (
              <>
                <Box display="inline">
                  <Text color="secondary"  bold fontSize="12px">
                    Collectable COWB Earned
                  </Text>
                </Box>
                <Balance bold fontSize="20px" decimals={0} value={earnedTokenBalance} />
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
              <>
                <Heading color="textDisabled">0</Heading>
                <Text fontSize="12px" color="textDisabled">
                  0 USD
                </Text>
              </>
            )}
          </>
        )}
      </Flex>
      <Button 
        disabled={!hasEarned} 
        onClick={handleHarvest}
        isLoading={pendingTx}
          endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
      >
        { t('Collect') }
      </Button>
    </Flex>
    </>
  )
}

export default HarvestActions
