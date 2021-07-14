import React, { useState } from 'react'
import {
  Modal,
  Text,
  Button,
  Heading,
  Flex,
  AutoRenewIcon,
  ButtonMenu,
  ButtonMenuItem,
  HelpIcon,
  useTooltip,
} from 'cowswap-uikit'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import { useSousHarvest, useClaim, useCollect } from 'hooks/useHarvest'
import { useSousStake } from 'hooks/useStake'
import useToast from 'hooks/useToast'
import { Token } from 'config/constants/types'
import { formatNumber } from 'utils/formatBalance'
import { getAddress } from 'utils/addressHelpers'

interface CollectModalProps {
  formattedBalance: string
  fullBalance: string
  earningToken: Token
  earningsDollarValue: number
  stakingToken: Token
  sousId: number
  onDismiss?: () => void
}

const CollectModal: React.FC<CollectModalProps> = ({
  formattedBalance,
  fullBalance,
  earningToken,
  earningsDollarValue,
  stakingToken,
  sousId,
  onDismiss,
}) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { toastSuccess, toastError } = useToast()

  const { onReward } = useClaim(getAddress(stakingToken.address))
  const { onCollect } = useCollect(getAddress(stakingToken.address))



  const [pendingTx, setPendingTx] = useState(false)
  const [shouldCompound, setShouldCompound] = useState(true)
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Text mb="12px">{t('Compound: collect and restake COWB into CowBoy.')}</Text>
      <Text>{t('Harvest: collect COWB and send to wallet')}</Text>
    </>,
    { placement: 'bottom-end', tooltipOffset: [20, 10] },
  )

  const handleHarvestConfirm = async () => {
    setPendingTx(true)
    // compounding
    if (shouldCompound) {
      try {
        await onCollect()
        toastSuccess(
          `${t('Compounded')}!`,
          t('Your %symbol% earnings have been re-invested into the Cowboy!', { symbol: earningToken.symbol }),
        )
        setPendingTx(false)
        onDismiss()
      } catch (e) {
        toastError(t('Canceled'), t('Please try again and confirm the transaction.'))
        setPendingTx(false)
      }
    } else {
      // harvesting
      try {
        await onReward()
        toastSuccess(
          `${t('Harvested')}!`,
          t('Your %symbol% earnings have been sent to your wallet!', { symbol: earningToken.symbol }),
        )
        setPendingTx(false)
        onDismiss()
      } catch (e) {
        toastError(t('Canceled'), t('Please try again and confirm the transaction.'))
        setPendingTx(false)
      }
    }
  }

  return (
    <Modal
      title={`${earningToken.symbol} ${t('Collect')}`}
      onDismiss={onDismiss}
      headerBackground={theme.colors.gradients.cardHeader}
    >
      <Flex justifyContent="center" alignItems="center" mb="24px">
        <ButtonMenu
          activeIndex={shouldCompound ? 0 : 1}
          scale="sm"
          variant="subtle"
          onItemClick={(index) => setShouldCompound(!index)}
        >
          <ButtonMenuItem as="button">{t('Compound')}</ButtonMenuItem>
          <ButtonMenuItem as="button">{t('Harvest')}</ButtonMenuItem>
        </ButtonMenu>
        <Flex ml="10px" ref={targetRef}>
          <HelpIcon color="textSubtle" />
        </Flex>
        {tooltipVisible && tooltip}
      </Flex>

      <Flex flexDirection="column" justifyContent="space-between" alignItems="center" mb="24px">
        
        <Flex flexDirection="row">
          <Heading>
            {formattedBalance} {earningToken.symbol}
          </Heading>
          {earningsDollarValue > 0 && (
            <Text fontSize="12px" color="textSubtle">{`~${formatNumber(earningsDollarValue)} USD`}</Text>
          )}
        </Flex>
      </Flex>

      <Button
        mt="8px"
        onClick={handleHarvestConfirm}
        isLoading={pendingTx}
        endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
      >
        {pendingTx ? t('Confirming') : t('Confirm')}
      </Button>
      <Button variant="text" onClick={onDismiss} pb="0px">
        {t('Close Window')}
      </Button>
    </Modal>
  )
}

export default CollectModal
