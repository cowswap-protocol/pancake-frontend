/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import priceLps from 'config/constants/priceLps'

import {
  fetchPrices
} from './fetchPrices'
import { PricesState, LpPrice } from '../types'

const pricesConfig = priceLps.map((lp) => ({
  ...lp
}))

const initialState: PricesState = { data: pricesConfig }

// Async thunks
export const fetchPricesAsync = createAsyncThunk<LpPrice[]>(
  'prices/fetchPricesDataAsync',
  async () => {
    const priceLpsWithPrice = await fetchPrices()
    return priceLpsWithPrice
  },
)

export const pricesSlice = createSlice({
  name: 'Prices',
  initialState,
  reducers: {
    // setLoadArchivedFarmsData: (state, action) => {
    //   const loadArchivedFarmsData = action.payload
    //   state.loadArchivedFarmsData = loadArchivedFarmsData
    // },
  },
  extraReducers: (builder) => {
    // Update farms with live data
    builder.addCase(fetchPricesAsync.fulfilled, (state, action) => {
      state.data = action.payload
    })
  },
})

export default pricesSlice.reducer

