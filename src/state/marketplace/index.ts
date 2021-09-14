/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { MarketplaceState, NftOrder, NftItem } from 'state/types'
import { nftSources } from 'config/constants/nfts'
import { NftType } from 'config/constants/types'
import { getAddress } from 'utils/addressHelpers'
import { getErc721Contract } from 'utils/contractHelpers'
import { getNftByTokenId, fetchTokenUriData } from 'utils/collectibles'
import { fetchMarketplaceOrders, fetchNftOrder, fetchUserOrders } from './fetchMarketplace'
import { fetchUserNfts } from './fetchNft'

const initialState: MarketplaceState = {
  isLoading: true,
  orders: {},
  userOrders: {},
  userSearch: {
    isLoading: false,
    address: '',
    name: '',
    symbol: '',
    items: [],
    itemsTotalLength: 0,
    itemsCurrentLength: 0,
  }
}

interface UserSearchResponse {
  address: string
  name: string
  symbol: string
  items: NftItem[]
  itemsTotalLength: number
  itemsCurrentLength: number
}


// Async thunks
export const fetchMarketplaceOrdersAsync = createAsyncThunk(
  'marketplace/fetchMarketplaceOrdersAsync',
  async () => {
    const orders = await fetchMarketplaceOrders()
    return orders
  },
)

export const fetchNftOrderAsync = createAsyncThunk(
  'marketplace/fetchNftOrderAsync',
  async(id: string) => {
    const order = await fetchNftOrder(id)
    return order
  }
)

export const fetchUserOrdersAsync = createAsyncThunk(
  'marketplace/fetchUserOrdersAsync',
  async(account: string ) => {
    const orders = await fetchUserOrders(account)
    return orders
  }
)

export const fetchUserNftsAsync = createAsyncThunk<UserSearchResponse, { address: string, account: string, start: number}>(
  'marketplace/fetchUserNftsAsync',
  async({address, account, start}) => {
    const items = await fetchUserNfts(address, account, start)
    return items
  }
)

export const fetchTokenURIAsync = createAsyncThunk<NftItem, { address: string, id: string, tokenURI: string }>(
  'marketplace/fetchTokenURIAsync',
  async({ address, id, tokenURI }) => {
    const metadata = await fetchTokenUriData(tokenURI)
    return {
      id,
      address,
      tokenURI,
      metadata
    }
  }
)


export const marketplaceSlice = createSlice({
  name: 'marketplace',
  initialState,
  reducers: {
    removeOrder: (state, action: PayloadAction<number>) => {
      delete state.orders[action.payload]
      delete state.userOrders[action.payload]
    },
    updateNftItemListed: (state, action: PayloadAction<{ id: string, listed: boolean }>) => {
      const item = state.userSearch.items.find(i => i.id === action.payload.id)
      item.listed = action.payload.listed
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMarketplaceOrdersAsync.pending, (state) => {
      state.isLoading = true
    })

    builder.addCase(fetchMarketplaceOrdersAsync.fulfilled, (state, action) => {
      state.isLoading = false
      action.payload.forEach(order => {
        state.orders[order.id] = order
      })
    })
    builder.addCase(fetchUserOrdersAsync.fulfilled, (state, action) => {
      state.isLoading = false
      action.payload.forEach(order => {
        state.userOrders[order.id] = order
      })
    })
    builder.addCase(fetchNftOrderAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.orders[action.payload.id] = action.payload
      if(state.userOrders[action.payload.id]) {
        state.userOrders[action.payload.id] = action.payload
      }
    })

    builder.addCase(fetchUserNftsAsync.pending, (state) => {
      state.userSearch.isLoading = true
    })

    builder.addCase(fetchUserNftsAsync.rejected, (state) => {
      state.userSearch.isLoading = false
      state.userSearch.error = "Invalid BEP721/ERC721 address"
    })

    builder.addCase(fetchUserNftsAsync.fulfilled, (state, action) => {
      const items = state.userSearch.items.slice(0)
      state.userSearch = { isLoading: false, ...action.payload }
      state.userSearch.items.forEach(item => {
        const cache = items.find(i => i.id === item.id)
        if(!item.metadata && cache){
          item.metadata = cache.metadata
        }
      })
    })

    builder.addCase(fetchTokenURIAsync.fulfilled, (state, action) => {
      const data = state.userSearch.items.find(item => item.id === action.payload.id)
      if(data) {
        data.metadata = action.payload.metadata
      }
    })
  },
})
export const { removeOrder, updateNftItemListed } = marketplaceSlice.actions
export default marketplaceSlice.reducer
