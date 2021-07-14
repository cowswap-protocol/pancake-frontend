import React, { useState } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { Flex, CardFooter, ExpandableLabel, HelpIcon, useTooltip } from 'cowswap-uikit'
import { Pot } from 'state/types'
import { CompoundingPoolTag, ManualPoolTag } from 'components/Tags'
import ExpandedFooter from './ExpandedFooter'

interface FooterProps {
  pool: Pot
  account: string
  totalCakeInVault?: BigNumber
}

const ExpandableButtonWrapper = styled(Flex)`
  align-items: center;
  justify-content: space-between;
  text-align: center;
  flex-direction: column;
  button {
    padding: 0;
  }
`

const CardFooterWrapper = styled(CardFooter)`
  padding: 10px 24px;
  text-align: center;
  align-items: center;
  justify-content: space-between;
`

const Footer: React.FC<FooterProps> = ({ pool, account }) => {
  // const { isAutoVault } = pool
  const isAutoVault = false
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(false)

  const manualTooltipText = t('You must harvest and compound your earnings from this pool manually.')
  const autoTooltipText = t(
    'Any funds you stake in this pool will be automagically harvested and restaked (compounded) for you.',
  )

  const { targetRef, tooltip, tooltipVisible } = useTooltip(isAutoVault ? autoTooltipText : manualTooltipText, {
    placement: 'bottom',
  })

  return (
    <CardFooterWrapper>
      <ExpandableButtonWrapper>
        <ExpandableLabel expanded={isExpanded} onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? t('Hide') : t('Details')}
        </ExpandableLabel>
      </ExpandableButtonWrapper>
      {isExpanded && <ExpandedFooter pool={pool} account={account} />}
    </CardFooterWrapper>
  )
}

export default Footer
