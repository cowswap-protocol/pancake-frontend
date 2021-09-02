import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Button, Flex, Text, Heading } from 'cowswap-uikit'
import { getAddress } from 'utils/addressHelpers'
import { useAppDispatch } from 'state'
import { fetchCowboyUserDataAsync } from 'state/cowboy'
import { Farm, Cowboy } from 'state/types'
import { useTranslation } from 'contexts/Localization'
import { useERC20 } from 'hooks/useContract'
import { useCowbApprove } from 'hooks/useApprove'
import UnlockButton from 'components/UnlockButton'
import StakeAction from './StakeAction'
import HarvestAction from './HarvestAction'

const Action = styled.div`
  padding-top: 16px;
`
// export interface FarmWithStakedValue extends Farm {
//   apr?: number
// }

interface FarmCardActionsProps {
  cowboy: Cowboy
  account?: string
}

const CardActions: React.FC<FarmCardActionsProps> = ({ cowboy, account }) => {
  const { t } = useTranslation()
  const [requestedApproval, setRequestedApproval] = useState(false)
  const { address: cowboyAddr } = cowboy
  const {
    allowance: allowanceAsString = 0,
    cowbBalance: cowbBalanceAsString = 0,
    cowboyBalance: cowboyBalanceAsString = 0,
  } = cowboy.userData || {}

  const allowance = new BigNumber(allowanceAsString)

  const cowbBalance = new BigNumber(cowbBalanceAsString)
  const cowboyBalance = new BigNumber(cowboyBalanceAsString)

  const isApproved = account && allowance && allowance.isGreaterThan(0)
  const dispatch = useAppDispatch()

  // const cowboyContract = useERC20(getAddress(cowboyAddr))

  const { onApprove } = useCowbApprove(getAddress(cowboyAddr))

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      await onApprove()
      dispatch(fetchCowboyUserDataAsync({ account }))
      setRequestedApproval(false)
    } catch (e) {
      console.error(e)
    }
  }, [onApprove, dispatch, account])

  const renderApprovalOrStakeButton = () => {
    return isApproved ? (
      <StakeAction
        stakedBalance={cowboyBalance}
        tokenBalance={cowbBalance}
        tokenName={cowboy.symbol}
        price={cowboy.price}
      />
    ) : (
      <Button mt="8px" width="100%" disabled={requestedApproval} onClick={handleApprove}>
        {t('Approve')}
      </Button>
    )
  }

  return (
    <Action>
      {!account ? <UnlockButton mt="8px" width="100%" /> : renderApprovalOrStakeButton()}
    </Action>
  )
}

export default CardActions
