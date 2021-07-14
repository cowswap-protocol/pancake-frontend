/* eslint-disable no-param-reassign */
import BigNumber from 'bignumber.js'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import potsConfig from 'config/constants/pots'
import { BIG_ZERO } from 'utils/bigNumber'

// import isArchivedPid from 'utils/farmHelpers'
// import priceHelperLpsConfig from 'config/constants/priceHelperLps'
// import fetchFarms from './fetchFarms'
// import fetchFarmsPrices from './fetchFarmsPrices'
// import {
//   fetchFarmUserEarnings,
//   fetchFarmUserAllowances,
//   fetchFarmUserTokenBalances,
//   fetchFarmUserStakedBalances,
// } from './fetchFarmUser'

import {
  fetchPotUserData,
  fetchPotsPublicData,
} from './fetchPotUser'

import { PotsState } from '../types'

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

export const fetchPotPublicDataAsync = createAsyncThunk<PotPublicDataResponse[], { ids: number[] }>(
  'pots/fetchPotPublicDataAsync',
  async ({ ids }) => {
    const potsToFetch = potsConfig.filter((config) => ids.includes(config.sousId))
    const publicData = await fetchPotsPublicData(potsToFetch)
    return publicData
  },
)

export const potsSlice = createSlice({
  name: 'Pots',
  initialState,
  reducers: {
    // setLoadArchivedFarmsData: (state, action) => {
    //   const loadArchivedFarmsData = action.payload
    //   state.loadArchivedFarmsData = loadArchivedFarmsData
    // },
  },
  extraReducers: (builder) => {
    // Update farms with live data
    // builder.addCase(fetchFarmsPublicDataAsync.fulfilled, (state, action) => {
    //   state.data = state.data.map((farm) => {
    //     const liveFarmData = action.payload.find((farmData) => farmData.pid === farm.pid)
    //     return { ...farm, ...liveFarmData }
    //   })
    // })

    builder.addCase(fetchPotPublicDataAsync.fulfilled, (state, action) => {
      action.payload.forEach((data) => {
        const { sousId } = data
        const index = state.data.findIndex((pot) => pot.sousId === sousId)
        // state.data[index].todayTotalStaked = data.todayTotalStaked
        state.data[index] = { ...state.data[index], todayTotalStaked: data.todayTotalStaked }
      })
    })

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
// export const { setLoadArchivedFarmsData } = farmsSlice.actions

export default potsSlice.reducer
