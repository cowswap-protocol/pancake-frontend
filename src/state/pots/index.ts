/* eslint-disable no-param-reassign */
import BigNumber from 'bignumber.js'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import potsConfig from 'config/constants/pots'
import { BIG_ZERO } from 'utils/bigNumber'
import { getAddress } from 'utils/addressHelpers'
import { getDate } from 'utils/getTimePeriods'
import { getPotApr } from 'utils/apr'
import { getBalanceNumber } from 'utils/formatBalance'

import {
  fetchPotUserData,
  fetchPotsPublicData,
} from './fetchPots'

import { PotsState, Pot } from '../types'
import { getTokenPricesFromLp } from '../prices/helpers'

const noAccountPotConfig = potsConfig.map((pot) => ({
  ...pot,
  todayTotalStaked: '0',
  userData: {
    stakedBalance: '0',
    pendingRewards: '0',
    unclaimRewards: '0'
  },
}))

const initialState: PotsState = { data: noAccountPotConfig, userDataLoaded: false }

interface PotUserDataResponse {
  sousId: number
  stakedBalance: string
  pendingRewards: string
  unclaimRewards: string
}

interface PotPublicDataResponse {
  sousId: number
  todayTotalStaked: string
}

export const fetchPotUserDataAsync = createAsyncThunk<PotUserDataResponse[], { account: string; ids: number[] }>(
  'pots/fetchPotUserDataAsync',
  async ({ account, ids }) => {
    const potsToFetch = potsConfig.filter((config) => ids.includes(config.sousId))
    const userPotsData = await fetchPotUserData(account, potsToFetch)
    return userPotsData
  },
)

export const fetchPotPublicDataAsync = () => async (dispatch, getState) => {
  const potsWithPublicData = await fetchPotsPublicData(potsConfig)

  const prices = getTokenPricesFromLp(getState().prices.data)
  console.log("prices=====", prices)

  const liveData = potsWithPublicData.map((pool) => {
    const today = getDate()
    const isPoolFinished = pool.isFinished || (pool.endTime < today)

    const stakingTokenAddress = pool.stakingToken.address ? getAddress(pool.stakingToken.address).toLowerCase() : null
    const stakingTokenPrice = stakingTokenAddress ? prices[stakingTokenAddress] : 0

    const earningTokenAddress = pool.earningToken.address ? getAddress(pool.earningToken.address).toLowerCase() : null
    const earningTokenPrice = earningTokenAddress ? prices[earningTokenAddress] : 0
    const apr = !isPoolFinished
      ? getPotApr(
          stakingTokenPrice,
          earningTokenPrice,
          getBalanceNumber(new BigNumber(pool.todayTotalStaked), pool.stakingToken.decimals),
          parseFloat(pool.dailyRewards),
        )
      : 0

    return {
      sousId: pool.sousId,
      todayTotalStaked: pool.todayTotalStaked,
      stakingTokenPrice,
      earningTokenPrice,
      apr,
      isFinished: isPoolFinished,
    }
  })

  console.log(liveData)

  dispatch(setPotsPublicData(liveData))
}


// export const fetchPotPublicDataAsync = createAsyncThunk<PotPublicDataResponse[], { ids: number[] }>(
//   'pots/fetchPotPublicDataAsync',
//   async ({ ids }) => {
//     const potsToFetch = potsConfig.filter((config) => ids.includes(config.sousId))
//     const publicData = await fetchPotsPublicData(potsToFetch)
//     return publicData
//   },
// )

export const potsSlice = createSlice({
  name: 'Pots',
  initialState,
  reducers: {
    // setLoadArchivedFarmsData: (state, action) => {
    //   const loadArchivedFarmsData = action.payload
    //   state.loadArchivedFarmsData = loadArchivedFarmsData
    // },
    setPotsPublicData: (state, action) => {
      const livePotsData: Pot[] = action.payload

      state.data = state.data.map((pot) => {
        const livePoolData = livePotsData.find((entry) => entry.sousId === pot.sousId)
        return { ...pot, ...livePoolData }
      })
    },
  },
  extraReducers: (builder) => {
    // Update farms with live data
    // builder.addCase(fetchFarmsPublicDataAsync.fulfilled, (state, action) => {
    //   state.data = state.data.map((farm) => {
    //     const liveFarmData = action.payload.find((farmData) => farmData.pid === farm.pid)
    //     return { ...farm, ...liveFarmData }
    //   })
    // })

    // builder.addCase(fetchPotPublicDataAsync.fulfilled, (state, action) => {
    //   action.payload.forEach((data) => {
    //     const { sousId } = data
    //     const index = state.data.findIndex((pot) => pot.sousId === sousId)
    //     // state.data[index].todayTotalStaked = data.todayTotalStaked
    //     state.data[index] = { ...state.data[index], todayTotalStaked: data.todayTotalStaked }
    //   })
    // })

    // Update farms with user data
    builder.addCase(fetchPotUserDataAsync.fulfilled, (state, action) => {
      action.payload.forEach((userDataEl) => {
        const { sousId } = userDataEl
        const index = state.data.findIndex((pot) => pot.sousId === sousId)
        state.data[index] = { ...state.data[index], userData:  userDataEl } // .userData = userDataEl
      })
      state.userDataLoaded = true
    })
  },
})

// Actions
export const { setPotsPublicData } = potsSlice.actions

export default potsSlice.reducer
