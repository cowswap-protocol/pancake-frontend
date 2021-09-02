import React from 'react'
import { Flex, useModal, CalculateIcon, Skeleton, FlexProps, Button } from 'cowswap-uikit'
import { BASE_EXCHANGE_URL } from 'config'
import ApyCalculatorModal from 'components/ApyCalculatorModal'
import Balance from 'components/Balance'
import { Pot } from 'state/types'
import { useTranslation } from 'contexts/Localization'
import { getAprData } from 'views/Pots/helpers'

interface AprProps extends FlexProps {
  pool: Pot
  showIcon: boolean
  performanceFee?: number
}

const Apr: React.FC<AprProps> = ({ pool, showIcon, performanceFee = 0, ...props }) => {
  const { stakingToken, earningToken, isFinished, earningTokenPrice, apr } = pool
  const { t } = useTranslation()

  const { apr: earningsPercentageToDisplay, roundingDecimals, compoundFrequency } = getAprData(pool, performanceFee)

  const apyModalLink =
    stakingToken.address &&
    `${BASE_EXCHANGE_URL}/#/swap?outputCurrency=${stakingToken.address[process.env.REACT_APP_CHAIN_ID]}`

  // const [onPresentApyModal] = useModal(
  //   <ApyCalculatorModal
  //     tokenPrice={earningTokenPrice}
  //     apr={apr}
  //     linkLabel={t('Get %symbol%', { symbol: stakingToken.symbol })}
  //     linkHref={apyModalLink || BASE_EXCHANGE_URL}
  //     earningTokenSymbol={earningToken.symbol}
  //     roundingDecimals={roundingDecimals}
  //     compoundFrequency={compoundFrequency}
  //     performanceFee={performanceFee}
  //   />,
  // )

  const openRoiModal = (event: React.MouseEvent<HTMLElement>) => {
    // event.stopPropagation()
    // onPresentApyModal()
  }

  return (
    <Flex alignItems="center" justifyContent="space-between" {...props}>
      {earningsPercentageToDisplay || isFinished ? (
        <>
          <Balance
            onClick={openRoiModal}
            fontSize="16px"
            isDisabled={isFinished}
            value={isFinished ? 0 : earningsPercentageToDisplay}
            decimals={2}
            unit="%"
          />
          
        </>
      ) : (
        <Skeleton width="80px" height="16px" />
      )}
    </Flex>
  )
}

export default Apr
