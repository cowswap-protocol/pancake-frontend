import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState } from 'react'
import { Button, Modal } from 'cowswap-uikit'
import ModalActions from 'components/ModalActions'
import ModalPriceInput from 'components/ModalInput/ModalPriceInput'
import { useTranslation } from 'contexts/Localization'
import { getFullDisplayBalance } from 'utils/formatBalance'

interface ChangePriceModalProps {
  onConfirm: (amount: string) => void
  onDismiss?: () => void
  tokenName?: string
  defaultValue?: string
}

const ChangePriceModal: React.FC<ChangePriceModalProps> = ({ onConfirm, onDismiss, defaultValue, tokenName = '' }) => {
  const [val, setVal] = useState(defaultValue)
  const [pendingTx, setPendingTx] = useState(false)
  const { t } = useTranslation()
  const defaultValNumber = new BigNumber(defaultValue)
  const valNumber = new BigNumber(val)

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      if (e.currentTarget.validity.valid) {
        setVal(e.currentTarget.value.replace(/,/g, '.'))
      }
    },
    [setVal],
  )


  return (
    <Modal title={t('Change Price')} onDismiss={onDismiss}>
      <ModalPriceInput
        onChange={handleChange}
        value={val}
        symbol={tokenName}
        inputTitle={t('Price')}
      />
      <ModalActions>
        <Button variant="secondary" onClick={onDismiss} width="100%" disabled={pendingTx}>
          {t('Cancel')}
        </Button>
        <Button
          disabled={pendingTx || !valNumber.isFinite() || valNumber.eq(0) || valNumber.eq(defaultValNumber) }
          onClick={async () => {
            setPendingTx(true)
            await onConfirm(val)
            setPendingTx(false)
            onDismiss()
          }}
          width="100%"
        >
          {pendingTx ? t('Pending Confirmation') : t('Confirm')}
        </Button>
      </ModalActions>
    </Modal>
  )
}

export default ChangePriceModal
