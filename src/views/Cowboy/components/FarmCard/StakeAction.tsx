import React, { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Button, Flex, Heading, IconButton, AddIcon, MinusIcon, useModal, Text } from 'cowswap-uikit'
import { useLocation } from 'react-router-dom'
import Balance from 'components/Balance'
import { useTranslation } from 'contexts/Localization'
import { useAppDispatch } from 'state'
import { fetchCowboyUserDataAsync } from 'state/cowboy'
import { useLpTokenPrice } from 'state/hooks'
import { useCowboyStake } from 'hooks/useStake'
import { useCowboyUnstake } from 'hooks/useUnstake'
import { getBalanceAmount, getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import DepositModal from '../DepositModal'
import WithdrawModal from '../WithdrawModal'

interface FarmCardActionsProps {
  stakedBalance?: BigNumber
  tokenBalance?: BigNumber
  tokenName?: string
  price?: string
}

const IconButtonWrapper = styled.div`
  display: flex;
  svg {
    width: 20px;
  }
`

const StakeAction: React.FC<FarmCardActionsProps> = ({
  stakedBalance,
  tokenBalance,
  tokenName,
  price,
}) => {
  const { t } = useTranslation()
  const { onStake } = useCowboyStake()
  const { onUnstake } = useCowboyUnstake()
  const location = useLocation()
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const lpPrice = new BigNumber(price)


  const handleStake = async (amount: string) => {
    await onStake(amount)
    dispatch(fetchCowboyUserDataAsync({ account }))
  }

  const handleUnstake = async (amount: string) => {
    await onUnstake(amount)
    dispatch(fetchCowboyUserDataAsync({ account }))
  }

  const displayBalance = useCallback(() => {
    const stakedBalanceBigNumber = getBalanceAmount(stakedBalance, 0)
    if (stakedBalanceBigNumber.gt(0) && stakedBalanceBigNumber.lt(0.0001)) {
      return getFullDisplayBalance(stakedBalance).toLocaleString()
    }
    return stakedBalanceBigNumber.toFixed(0, BigNumber.ROUND_DOWN)
  }, [stakedBalance])

  const [onPresentDeposit] = useModal(
    <DepositModal max={tokenBalance} onConfirm={handleStake} tokenName="COWB" />,
  )
  const [onPresentWithdraw] = useModal(
    <WithdrawModal max={stakedBalance} onConfirm={handleUnstake} tokenName="COWBOY" />,
  )

  const renderStakingButtons = () => {
    return stakedBalance.eq(0) ? (
      <Button
        onClick={onPresentDeposit}
        disabled={['history', 'archived'].some((item) => location.pathname.includes(item))}
      >
        {t('Stake COWB')}
      </Button>
    ) : (
      <IconButtonWrapper>
        <IconButton variant="tertiary" onClick={onPresentWithdraw} mr="6px">
          <MinusIcon color="primary" width="14px" />
        </IconButton>
        <IconButton
          variant="tertiary"
          onClick={onPresentDeposit}
          disabled={['history', 'archived'].some((item) => location.pathname.includes(item))}
        >
          <AddIcon color="primary" width="14px" />
        </IconButton>
      </IconButtonWrapper>
    )
  }

  return (
    <Flex justifyContent="space-between" alignItems="center">
      <Flex flexDirection="column" alignItems="flex-start">
        <Text bold  color="secondary" fontSize="12px" pr="4px">YOUR COWBOY</Text>
        <Heading color={stakedBalance.eq(0) ? 'textDisabled' : 'text'}>{displayBalance()}</Heading>
        {stakedBalance.gt(0) && lpPrice.gt(0) && (
          <Balance
            fontSize="12px"
            color="textSubtle"
            decimals={0}
            value={getBalanceNumber(lpPrice.times(stakedBalance), 0)}
            unit=" COWB"
            prefix=""
          />
        )}
      </Flex>
      {renderStakingButtons()}
    </Flex>
  )
}

export default StakeAction
