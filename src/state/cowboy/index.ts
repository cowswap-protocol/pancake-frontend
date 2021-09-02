/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import cowboyConfig from 'config/constants/cowboy'
import { CowboyState, Cowboy } from '../types'

import { fetchCowboyPublicData, fetchCowboyUserData } from './fetchCowboy'

const noAccountCowboyConfig = {
  ...cowboyConfig,
  userData: {
    allowance: '0',
    cowbBalance: '0',
    cowboyBalance: '0',
  },
}

const initialState: CowboyState = { data: noAccountCowboyConfig, userDataLoaded: false }

// Async thunks
export const fetchCowboyPublicDataAsync = createAsyncThunk(
  'cowboy/fetchCowboyPublicDataAsync',
  async () => {
    const data = await fetchCowboyPublicData()
    return data
  },
)

interface CowboyUserDataResponse {
  allowance: string
  cowbBalance: string
  cowboyBalance: string
}

export const fetchCowboyUserDataAsync = createAsyncThunk<CowboyUserDataResponse, { account: string }>(
  'cowboy/fetchCowboyUserDataAsync',
  async ({ account }) => {
    const userData = await fetchCowboyUserData(account)
    return userData
  },
)

export const cowboySlice = createSlice({
  name: 'Cowboy',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    // Update cowboy with live data
    builder.addCase(fetchCowboyPublicDataAsync.fulfilled, (state, action) => {
      state.data = { ...state.data, ...action.payload }
    })

    // Update cowboy with user data
    builder.addCase(fetchCowboyUserDataAsync.fulfilled, (state, action) => {
      state.data = { ...state.data, userData: action.payload }
      state.userDataLoaded = true
    })
  },
})

export default cowboySlice.reducer
