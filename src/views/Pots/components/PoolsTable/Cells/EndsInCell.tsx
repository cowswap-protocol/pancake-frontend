import React from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { Flex, Link, Skeleton, Text, TimerIcon } from 'cowswap-uikit'
import { getBscScanBlockCountdownUrl } from 'utils/bscscan'
import { Pot } from 'state/types'
import { useBlock } from 'state/hooks'
import Balance from 'components/Balance'
import { useTranslation } from 'contexts/Localization'
import { getPoolBlockInfo } from 'views/Pots/helpers'
import { BIG_ZERO } from 'utils/bigNumber'
import getTimePeriods, { getTimestamp } from 'utils/getTimePeriods'
import BaseCell, { CellContent } from './BaseCell'

interface FinishCellProps {
  pool: Pot
}

const StyledCell = styled(BaseCell)`
  flex: 2 0 100px;
`

const EndsInCell: React.FC<FinishCellProps> = ({ pool }) => {
  const { sousId, isFinished, userData, startTime, endTime } = pool
  const totalStaked = userData ? userData.stakedBalance : BIG_ZERO
  const now = getTimestamp()
  const { t } = useTranslation()

  const hasPoolStarted = startTime < now
  const hasOver = endTime < now

  const { days, hours, minutes } = getTimePeriods(hasPoolStarted ? endTime - now : startTime - now)

  // const { shouldShowBlockCountdown, blocksUntilStart, blocksRemaining, hasPoolStarted, blocksToDisplay } =
    // getPoolBlockInfo(pool, currentBlock)

  // const isCakePool = sousId === 0

  // const renderBlocks = shouldShowBlockCountdown ? (
  //   <Flex alignItems="center">
  //     <Flex flex="1.3">
  //       <Balance fontSize="16px" value={blocksToDisplay} decimals={0} />
  //       <Text ml="4px" textTransform="lowercase">
  //         {t('Blocks')}
  //       </Text>
  //     </Flex>
  //     <Flex flex="1">
  //       <Link
  //         external
  //         href={getBscScanBlockCountdownUrl(hasPoolStarted ? endBlock : startBlock)}
  //         onClick={(e) => e.stopPropagation()}
  //       >
  //         <TimerIcon ml="4px" />
  //       </Link>
  //     </Flex>
  //   </Flex>
  // ) : (
  //   <Text>-</Text>
  // )

  // A bit hacky way to determine if public data is loading relying on totalStaked
  // Opted to go for this since we don't really need a separate publicDataLoaded flag
  // anywhere else
  // const isLoadingPublicData = !totalStaked.gt(0) || !currentBlock || (!blocksRemaining && !blocksUntilStart)
  // const showLoading = isLoadingPublicData && !isFinished
  return (
    <StyledCell role="cell">
      <CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {hasPoolStarted ? t('Ends in') : t('Starts in')}
        </Text>
        <Text>
          { !hasOver ?
            (<Text>{t('%day%d : %hour%h : %minute%m', { day: days, hour: hours, minute: minutes })}</Text>)
            :
            (<Text> - </Text>)
          }
        </Text>
      </CellContent>
    </StyledCell>
  )
}

export default EndsInCell
