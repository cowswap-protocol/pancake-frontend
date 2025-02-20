import React from 'react'
import styled, { keyframes, css } from 'styled-components'
import {
  Box,
  Button,
  Flex,
  HelpIcon,
  Link,
  LinkExternal,
  MetamaskIcon,
  Skeleton,
  Text,
  TimerIcon,
  useTooltip,
} from 'cowswap-uikit'
import { BASE_BSC_SCAN_URL, BASE_URL } from 'config'
import { getBscScanBlockCountdownUrl } from 'utils/bscscan'
import { useBlock, useCakeVault } from 'state/hooks'
import BigNumber from 'bignumber.js'
import { Pot } from 'state/types'
import { useTranslation } from 'contexts/Localization'
import Balance from 'components/Balance'
import { CompoundingPoolTag, ManualPoolTag } from 'components/Tags'
import { getAddress, getCakeVaultAddress } from 'utils/addressHelpers'
import { registerToken } from 'utils/wallet'
import { getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import { getPoolBlockInfo } from 'views/Pots/helpers'
import { POT_ADDRESS } from 'config/constants/pots'
import Harvest from './Harvest'
import Stake from './Stake'
import Apr from '../Apr'


const expandAnimation = keyframes`
  from {
    max-height: 0px;
  }
  to {
    max-height: 700px;
  }
`

const collapseAnimation = keyframes`
  from {
    max-height: 700px;
  }
  to {
    max-height: 0px;
  }
`

const StyledActionPanel = styled.div<{ expanded: boolean }>`
  animation: ${({ expanded }) =>
    expanded
      ? css`
          ${expandAnimation} 300ms linear forwards
        `
      : css`
          ${collapseAnimation} 300ms linear forwards
        `};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.dropdown};
  display: flex;
  flex-direction: column-reverse;
  justify-content: center;
  padding: 12px;

  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
    padding: 16px 32px;
  }
`

const ActionContainer = styled.div`
  display: flex;
  flex-direction: column;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    align-items: center;
    flex-grow: 1;
    flex-basis: 0;
  }
`

type MediaBreakpoints = {
  isXs: boolean
  isSm: boolean
  isMd: boolean
  isLg: boolean
  isXl: boolean
}

interface ActionPanelProps {
  account: string
  pool: Pot
  userDataLoaded: boolean
  expanded: boolean
  breakpoints: MediaBreakpoints
}

const InfoSection = styled(Box)`
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: auto;
  padding: 8px 8px;
  ${({ theme }) => theme.mediaQueries.lg} {
    padding: 0;
    flex-basis: 260px;
  }
`

const ActionPanel: React.FC<ActionPanelProps> = ({ account, pool, userDataLoaded, expanded, breakpoints }) => {
  const {
    sousId,
    stakingToken,
    earningToken,
    todayTotalStaked,
    userDailyMax,
  } = pool


  const stakingLimit = new BigNumber(userDailyMax)
  const isAutoVault = false
  const totalStaked = new BigNumber(todayTotalStaked)

  const { t } = useTranslation()
  const poolContractAddress = getAddress(POT_ADDRESS) // getAddress(contractAddress)
  const cakeVaultContractAddress = getCakeVaultAddress()
  // const { currentBlock } = useBlock()
  const { isXs, isSm, isMd } = breakpoints
  const showSubtitle = (isXs || isSm) && sousId === 0

  // const { shouldShowBlockCountdown, blocksUntilStart, blocksRemaining, hasPoolStarted, blocksToDisplay } =
    // getPoolBlockInfo(pool, currentBlock)

  const isMetaMaskInScope = !!(window as WindowChain).ethereum?.isMetaMask
  const tokenAddress = earningToken.address ? getAddress(earningToken.address) : ''
  const imageSrc = `${BASE_URL}/images/tokens/${tokenAddress}.png`

  const {
    totalCakeInVault,
    fees: { performanceFee },
  } = useCakeVault()

  const performanceFeeAsDecimal = performanceFee && performanceFee / 100
  const isManualCakePool = sousId === 0

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

  const manualTooltipText = t('You must harvest and compound your earnings from this pool manually.')
  const autoTooltipText = t(
    'Any funds you stake in this pool will be automagically harvested and restaked (compounded) for you.',
  )

  const {
    targetRef: tagTargetRef,
    tooltip: tagTooltip,
    tooltipVisible: tagTooltipVisible,
  } = useTooltip(isAutoVault ? autoTooltipText : manualTooltipText, {
    placement: 'bottom-start',
  })

  const maxStakeRow = stakingLimit.gt(0) ? (
    <Flex mb="10px" justifyContent="space-between">
      <Text>{t('Daily Max per user')}:</Text>
      <Text>{`${stakingLimit.toFixed(0)} ${stakingToken.symbol}`}</Text>
    </Flex>
  ) : null

  // const blocksRow =
  //   blocksRemaining || blocksUntilStart ? (
  //     <Flex mb="8px" justifyContent="space-between">
  //       <Text>{hasPoolStarted ? t('Ends in') : t('Starts in')}:</Text>
  //       <Flex>
  //         <Link external href={getBscScanBlockCountdownUrl(hasPoolStarted ? endBlock : startBlock)}>
  //           <Balance fontSize="16px" value={blocksToDisplay} decimals={0} color="primary" />
  //           <Text ml="4px" color="primary" textTransform="lowercase">
  //             {t('Blocks')}
  //           </Text>
  //           <TimerIcon ml="4px" color="primary" />
  //         </Link>
  //       </Flex>
  //     </Flex>
  //   ) : (
  //     <Skeleton width="56px" height="16px" />
  //   )

  const aprRow = (
    <Flex justifyContent="space-between" alignItems="center" mb="8px">
      <Text>{ t('APR') }:</Text>
      <Apr pool={pool} showIcon performanceFee={0} />
    </Flex>
  )

  const totalStakedRow = (
    <Flex justifyContent="space-between" alignItems="center" mb="8px">
      <Text maxWidth={['50px', '100%']}>{t('Total staked')}:</Text>
      <Flex alignItems="center">
        {totalStaked && totalStaked.gte(0) ? (
          <>
            <Balance fontSize="16px" value={getTotalStakedBalance()} decimals={0} unit={` ${stakingToken.symbol}`} />
            <span ref={totalStakedTargetRef}>
              <HelpIcon color="textSubtle" width="20px" ml="4px" />
            </span>
          </>
        ) : (
          <Skeleton width="56px" height="16px" />
        )}
        {totalStakedTooltipVisible && totalStakedTooltip}
      </Flex>
    </Flex>
  )

  return (
    <StyledActionPanel expanded={expanded}>
      <InfoSection>
        {maxStakeRow}
        {(isXs || isSm) && aprRow}
        {(isXs || isSm || isMd) && totalStakedRow}

        <Flex mb="8px" justifyContent={['flex-end', 'flex-end', 'flex-start']}>
          <Link color="text" href="/">{t('Start Mining')}</Link>
        </Flex>
        
        <Flex mb="8px" justifyContent={['flex-end', 'flex-end', 'flex-start']}>
          <LinkExternal href={`https://pancakeswap.info/token/${getAddress(earningToken.address)}`} bold={false}>
            {t('See Token Info')}
          </LinkExternal>
        </Flex>
        <Flex mb="8px" justifyContent={['flex-end', 'flex-end', 'flex-start']}>
          <LinkExternal href={earningToken.projectLink} bold={false}>
            {t('View Project Site')}
          </LinkExternal>
        </Flex>
        {poolContractAddress && (
          <Flex mb="8px" justifyContent={['flex-end', 'flex-end', 'flex-start']}>
            <LinkExternal
              href={`${BASE_BSC_SCAN_URL}/address/${poolContractAddress}`}
              bold={false}
            >
              {t('View Contract')}
            </LinkExternal>
          </Flex>
        )}

      </InfoSection>
      <ActionContainer>
        
        <Harvest {...pool} userDataLoaded={userDataLoaded} />
        
      </ActionContainer>
    </StyledActionPanel>
  )
}

export default ActionPanel
