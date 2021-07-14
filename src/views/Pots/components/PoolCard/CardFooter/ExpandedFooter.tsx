import React from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import { useTranslation } from 'contexts/Localization'
import {
  Flex,
  MetamaskIcon,
  Text,
  TooltipText,
  LinkExternal,
  TimerIcon,
  Skeleton,
  useTooltip,
  Button,
  Link,
  HelpIcon,
} from 'cowswap-uikit'
import { BASE_BSC_SCAN_URL, BASE_URL } from 'config'
import { useBlock, useCakeVault } from 'state/hooks'
import { Pot } from 'state/types'
import { getAddress, getCakeVaultAddress } from 'utils/addressHelpers'
import { registerToken } from 'utils/wallet'
import { getBscScanBlockCountdownUrl } from 'utils/bscscan'
import Balance from 'components/Balance'
import { getPoolBlockInfo } from 'views/Pots/helpers'
import { POT_ADDRESS } from 'config/constants/pots'
import getTimePeriods, { getTimestamp } from 'utils/getTimePeriods'


interface ExpandedFooterProps {
  pool: Pot
  account: string
}

const ExpandedWrapper = styled(Flex)`
  svg {
    height: 14px;
    width: 14px;
  }
`

const ExpandedFooter: React.FC<ExpandedFooterProps> = ({ pool, account }) => {
  const { t } = useTranslation()
  const { currentBlock } = useBlock()
  const {
    totalCakeInVault,
    fees: { performanceFee },
  } = useCakeVault()

  const {
    sousId,
    stakingToken,
    earningToken,
    todayTotalStaked,
    userDailyMax,
    startTime,
    endTime,
  } = pool

  const totalStaked = new BigNumber(todayTotalStaked)
  const stakingLimit = new BigNumber(userDailyMax)

  const tokenAddress = earningToken.address ? getAddress(earningToken.address) : ''
  const poolContractAddress = getAddress(POT_ADDRESS)
  // const cakeVaultContractAddress = getCakeVaultAddress()
  const imageSrc = `${BASE_URL}/images/tokens/${tokenAddress}.png`
  const isMetaMaskInScope = !!(window as WindowChain).ethereum?.isMetaMask

  const now = getTimestamp()
  const hasPoolStarted = startTime < now
  const hasOver = endTime < now

  const { days, hours, minutes } = getTimePeriods(hasPoolStarted ? endTime - now : startTime - now)


  const getTotalStakedBalance = () => {
    return getBalanceNumber(totalStaked, stakingToken.decimals)
  }

  const {
    targetRef: totalStakedTargetRef,
    tooltip: totalStakedTooltip,
    tooltipVisible: totalStakedTooltipVisible,
  } = useTooltip(t('Total amount of %symbol% traded today', { symbol: stakingToken.symbol }), {
    placement: 'bottom',
  })

  return (
    <ExpandedWrapper flexDirection="column">
      <Flex mb="2px" justifyContent="space-between" alignItems="center">
        <Text small>{t('Today total traded')}:</Text>
        <Flex alignItems="flex-start">
          {totalStaked && totalStaked.gte(0) ? (
            <>
              <Balance small value={getTotalStakedBalance()} decimals={0} unit={` ${stakingToken.symbol}`} />
              <span ref={totalStakedTargetRef}>
                <HelpIcon color="textSubtle" width="20px" ml="6px" mt="4px" />
              </span>
            </>
          ) : (
            <Skeleton width="90px" height="21px" />
          )}
          {totalStakedTooltipVisible && totalStakedTooltip}
        </Flex>
      </Flex>
      {stakingLimit && stakingLimit.gt(0) && (
        <Flex mb="2px" justifyContent="space-between">
          <Text small>{t('Max. stake per user')}:</Text>
          <Text small>{`${getFullDisplayBalance(stakingLimit, stakingToken.decimals, 0)} ${stakingToken.symbol}`}</Text>
        </Flex>
      )}

      <Flex mb="2px" justifyContent="space-between" alignItems="center">
        <Text small>{hasPoolStarted ? t('Ends in') : t('Starts in')}:</Text>
        <Text>{ !hasOver ? t('%day%d : %hour%h : %minute%m', { day: days, hour: hours, minute: minutes }) : '--'}</Text>
      </Flex>
      
      <Flex mb="2px" justifyContent="flex-end">
        <LinkExternal href={`https://pancakeswap.info/token/${getAddress(earningToken.address)}`} bold={false} small>
          {t('See Token Info')}
        </LinkExternal>
      </Flex>
      <Flex mb="2px" justifyContent="flex-end">
        <LinkExternal href={earningToken.projectLink} bold={false} small>
          {t('View Project Site')}
        </LinkExternal>
      </Flex>
      {poolContractAddress && (
        <Flex mb="2px" justifyContent="flex-end">
          <LinkExternal
            href={`${BASE_BSC_SCAN_URL}/address/${poolContractAddress}`}
            bold={false}
            small
          >
            {t('View Contract')}
          </LinkExternal>
        </Flex>
      )}
      {account && isMetaMaskInScope && tokenAddress && (
        <Flex justifyContent="flex-end">
          <Button
            variant="text"
            p="0"
            height="auto"
            onClick={() => registerToken(tokenAddress, earningToken.symbol, earningToken.decimals, imageSrc)}
          >
            <Text color="primary" fontSize="14px">
              {t('Add to Metamask')}
            </Text>
            <MetamaskIcon ml="4px" />
          </Button>
        </Flex>
      )}
    </ExpandedWrapper>
  )
}

export default React.memo(ExpandedFooter)
