import React, { useMemo } from 'react'
import { Flex, Skeleton, Text } from 'cowswap-uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import BigNumber from 'bignumber.js'
import Balance from 'components/Balance'
import { Pot } from 'state/types'
import { useCakeVault } from 'state/hooks'
import { getBalanceNumber } from 'utils/formatBalance'
import { BIG_ZERO } from 'utils/bigNumber'
import BaseCell, { CellContent } from './BaseCell'

interface TotalStakedCellProps {
  pool: Pot
}

const StyledCell = styled(BaseCell)`
  flex: 2 0 100px;
`

const TotalStakedCell: React.FC<TotalStakedCellProps> = ({ pool }) => {
  const { t } = useTranslation()
  
  const { sousId, stakingToken, userData, todayTotalStaked, earningTokenPrice, stakingTokenPrice } = pool

  const totalStaked = getBalanceNumber(new BigNumber(todayTotalStaked), stakingToken.decimals) // userData ? userData.stakedBalance : BIG_ZERO

  const totalStakedUSD = totalStaked * stakingTokenPrice

  // const { totalCakeInVault } = useCakeVault()

  // const isManualCakePool = sousId === 0

  // const totalStakedBalance = useMemo(() => {
  //   if (isAutoVault) {
  //     return getBalanceNumber(totalCakeInVault, stakingToken.decimals)
  //   }
  //   if (isManualCakePool) {
  //     const manualCakeTotalMinusAutoVault = new BigNumber(totalStaked).minus(totalCakeInVault)
  //     return getBalanceNumber(manualCakeTotalMinusAutoVault, stakingToken.decimals)
  //   }
  //   return getBalanceNumber(totalStaked, stakingToken.decimals)
  // }, [isAutoVault, totalCakeInVault, isManualCakePool, totalStaked, stakingToken.decimals])

  // const totalStakedBalance = totalStaked.toNumber()

  return (
    <StyledCell role="cell">
      <CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {t('Total traded')}
        </Text>
        {totalStaked >= 0 ? (
          <Flex height="20px" alignItems="center">
            <Balance fontSize="16px" value={totalStaked} decimals={2} unit={` ${stakingToken.symbol}`} />
          </Flex>
        ) : (
          <Skeleton width="80px" height="16px" />
        )}
        {totalStaked > 0 ? (
          <>
            {earningTokenPrice > 0 && (
              <Balance
                display="inline"
                fontSize="12px"
                color="textSubtle"
                decimals={2}
                prefix="~"
                value={totalStakedUSD}
                unit=" USD"
              />
            )}
          </>
        ) : null }
      </CellContent>
    </StyledCell>
  )
}

export default TotalStakedCell
