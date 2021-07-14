import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { Heading, Flex, Image, Text } from 'cowswap-uikit'
import orderBy from 'lodash/orderBy'
import partition from 'lodash/partition'
import { useTranslation } from 'contexts/Localization'
import usePersistState from 'hooks/usePersistState'
import { usePools, useFetchCakeVault, useFetchPublicPoolsData, usePollPotsData, useCakeVault, usePots } from 'state/hooks'
import { latinise } from 'utils/latinise'
import FlexLayout from 'components/layout/Flex'
import Page from 'components/layout/Page'
import PageHeader from 'components/PageHeader'
import SearchInput from 'components/SearchInput'
import Select, { OptionProps } from 'components/Select/Select'
import { Pot } from 'state/types'
import { getTimestamp } from 'utils/getTimePeriods'

import PoolCard from './components/PoolCard'
// import CakeVaultCard from './components/CakeVaultCard'
import PoolTabButtons from './components/PoolTabButtons'
// import BountyCard from './components/BountyCard'
import HelpButton from './components/HelpButton'
import PoolsTable from './components/PoolsTable/PoolsTable'
import { ViewMode } from './components/ToggleView/ToggleView'
import { getAprData, getCakeVaultEarnings } from './helpers'

const CardLayout = styled(FlexLayout)`
  justify-content: center;
`

const PoolControls = styled(Flex)`
  flex-direction: column;
  margin-bottom: 24px;
  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
  }
`

const SearchSortContainer = styled(Flex)`
  gap: 10px;
  justify-content: space-between;
`

const ControlStretch = styled(Flex)`
  > div {
    flex: 1;
  }
`

const NUMBER_OF_POOLS_VISIBLE = 12

const Pots: React.FC = () => {
  const location = useLocation()
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { data: pots, userDataLoaded } = usePots(account)
  const [stakedOnly, setStakedOnly] = usePersistState(false, { localStorageKey: 'cowswap_pot_staked' })
  const [numberOfPoolsVisible, setNumberOfPoolsVisible] = useState(NUMBER_OF_POOLS_VISIBLE)
  const [observerIsSet, setObserverIsSet] = useState(false)
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const [viewMode, setViewMode] = usePersistState(ViewMode.TABLE, { localStorageKey: 'pancake_farm_view' })
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOption, setSortOption] = useState('hot')
  // const {
  //   userData: { cakeAtLastUserAction, userShares },
  //   fees: { performanceFee },
  //   pricePerFullShare,
  //   totalCakeInVault,
  // } = useCakeVault()
  // const accountHasVaultShares = userShares && userShares.gt(0)
  // const performanceFeeAsDecimal = performanceFee && performanceFee / 100

  // const pools = useMemo(() => {
  //   const cakePool = poolsWithoutAutoVault.find((pool) => pool.sousId === 0)
  //   const cakeAutoVault = { ...cakePool, isAutoVault: true }
  //   return [cakeAutoVault, ...poolsWithoutAutoVault]
  // }, [poolsWithoutAutoVault])

  // TODO aren't arrays in dep array checked just by reference, i.e. it will rerender every time reference changes?
  const now = getTimestamp()
  const [openPools, finishedPools] = useMemo(() => partition(pots, (pool) => pool.endTime > now), [pots, now])

  // const stakedOnlyFinishedPools = finishedPools
  // const stakedOnlyOpenPools = openPools

  const stakedOnlyFinishedPools = useMemo(
    () =>
      finishedPools.filter((pool) => {
        return pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0)
      }),
    [finishedPools],
  )
  const stakedOnlyOpenPools = useMemo(
    () =>
      openPools.filter((pool) => {
        return pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0)
      }),
    [openPools],
  )
  const hasStakeInFinishedPools = stakedOnlyFinishedPools.length > 0

  usePollPotsData()
  // useFetchCakeVault()
  // useFetchPublicPoolsData()

  useEffect(() => {
    const showMorePools = (entries) => {
      const [entry] = entries
      if (entry.isIntersecting) {
        setNumberOfPoolsVisible((poolsCurrentlyVisible) => poolsCurrentlyVisible + NUMBER_OF_POOLS_VISIBLE)
      }
    }

    if (!observerIsSet) {
      const loadMoreObserver = new IntersectionObserver(showMorePools, {
        rootMargin: '0px',
        threshold: 1,
      })
      loadMoreObserver.observe(loadMoreRef.current)
      setObserverIsSet(true)
    }
  }, [observerIsSet])

  const showFinishedPools = location.pathname.includes('history')

  const handleChangeSearchQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }

  const handleSortOptionChange = (option: OptionProps): void => {
    setSortOption(option.value)
  }

  // const sortPools = (poolsToSort: Pool[]) => {
  //   switch (sortOption) {
  //     case 'apr':
  //       // Ternary is needed to prevent pools without APR (like MIX) getting top spot
  //       return orderBy(
  //         poolsToSort,
  //         (pool: Pool) => (pool.apr ? getAprData(pool, performanceFeeAsDecimal).apr : 0),
  //         'desc',
  //       )
  //     case 'earned':
  //       return orderBy(
  //         poolsToSort,
  //         (pool: Pool) => {
  //           if (!pool.userData || !pool.earningTokenPrice) {
  //             return 0
  //           }
  //           return pool.isAutoVault
  //             ? getCakeVaultEarnings(
  //                 account,
  //                 cakeAtLastUserAction,
  //                 userShares,
  //                 pricePerFullShare,
  //                 pool.earningTokenPrice,
  //               ).autoUsdToDisplay
  //             : pool.userData.pendingReward.times(pool.earningTokenPrice).toNumber()
  //         },
  //         'desc',
  //       )
  //     case 'totalStaked':
  //       return orderBy(
  //         poolsToSort,
  //         (pool: Pool) => (pool.isAutoVault ? totalCakeInVault.toNumber() : pool.totalStaked.toNumber()),
  //         'desc',
  //       )
  //     default:
  //       return poolsToSort
  //   }
  // }

  const poolsToShow = () => {
    let chosenPools = []
    if (showFinishedPools) {
      chosenPools = stakedOnly ? stakedOnlyFinishedPools : finishedPools
    } else {
      chosenPools = stakedOnly ? stakedOnlyOpenPools : openPools
    }

    return chosenPools
  }

  const cardLayout = (
    <CardLayout>
      {poolsToShow().map((pool) =>
        <PoolCard key={pool.sousId} pool={pool} account={account} />
      )}
    </CardLayout>
  )

  const tableLayout = <PoolsTable pools={poolsToShow()} account={account} userDataLoaded={userDataLoaded} />

  return (
    <>
      <PageHeader>
        <Flex justifyContent="space-between" flexDirection={['column', null, null, 'row']}>
          <Flex flex="1" flexDirection="column" mr={['8px', 0]}>
            <Heading as="h1" scale="xxl" color="secondary" mb="24px">
              {t('Proof of Trade')}
            </Heading>
            <Heading scale="md" color="text">
              {t('Just trade some tokens on Cowswap to earn COWB.')}
            </Heading>
            <Heading scale="md" color="text">
              {t('No risk.')}
            </Heading>
          </Flex>
          <Flex flex="1" height="fit-content" justifyContent="center" alignItems="center" mt={['24px', null, '0']}>
            { /* <HelpButton /> */ }
            { /* <BountyCard /> */ }
          </Flex>
        </Flex>
      </PageHeader>
      <Page>
        <PoolControls justifyContent="space-between">
          <PoolTabButtons
            stakedOnly={stakedOnly}
            setStakedOnly={setStakedOnly}
            hasStakeInFinishedPools={hasStakeInFinishedPools}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
          { false && (<SearchSortContainer>
            <Flex flexDirection="column" width="50%">
              <Text fontSize="12px" bold color="textSubtle" textTransform="uppercase">
                {t('Sort by')}
              </Text>
              <ControlStretch>
                <Select
                  options={[
                    {
                      label: t('Hot'),
                      value: 'hot',
                    },
                    {
                      label: t('APR'),
                      value: 'apr',
                    },
                    {
                      label: t('Earned'),
                      value: 'earned',
                    },
                    {
                      label: t('Total staked'),
                      value: 'totalStaked',
                    },
                  ]}
                  onChange={handleSortOptionChange}
                />
              </ControlStretch>
            </Flex>
            <Flex flexDirection="column" width="50%">
              <Text fontSize="12px" bold color="textSubtle" textTransform="uppercase">
                {t('Search')}
              </Text>
              <ControlStretch>
                <SearchInput onChange={handleChangeSearchQuery} placeholder="Search Pools" />
              </ControlStretch>
            </Flex>
          </SearchSortContainer>)
          }
        </PoolControls>

        {showFinishedPools && (
          <Text fontSize="20px" color="failure" pb="32px">
            {t('These pools are no longer distributing rewards. Please collect your rewards.')}
          </Text>
        )}
        {viewMode === ViewMode.CARD ? cardLayout : tableLayout}
        <div ref={loadMoreRef} />
        <Image
          mx="auto"
          mt="12px"
          src="/images/cowb.svg"
          alt="Pancake illustration"
          width={100}
          height={100}
        />
      </Page>
    </>
  )
}

export default Pots
