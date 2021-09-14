import BigNumber from 'bignumber.js'
import marketplaceABI from 'config/abi/marketplace.json'
import erc721ABI from 'config/abi/erc721.json'
import multicall, { multicallv2 } from 'utils/multicall'
import { getMarketplaceAddress } from 'utils/addressHelpers'
import { fetchTokenUriData } from 'utils/collectibles'
import { NftInfo } from '../types'
// import { BIG_TEN, BIG_ZERO } from 'utils/bigNumber'

export const fetchUserNfts = async(address: string, account: string, start: number) => {
  const calls = [
    {
      address,
      name: 'symbol',
    },
    {
      address,
      name: 'name',
    },
    {
      address,
      name: "balanceOf",
      params: [ account ]
    }
  ]
  const [ [ symbol ], [ name ], [ balanceOf ] ] = await multicall(erc721ABI, calls)


  
  const nft = {
    address,
    name,
    symbol
  }



  const count = balanceOf.toNumber() > 30 ? 30 : balanceOf.toNumber()
 
  const idCalls = Array.from({ length: count }, (_, i) => {
    return {
      address,
      name: "tokenOfOwnerByIndex",
      params: [ account, start + i ]
    }
  })

  const tokenIds = await multicall(erc721ABI, idCalls)  

  const uriCalls = tokenIds.map(id => {
    return {
      address,
      name: "tokenURI",
      params: [ id.toString() ]
    }
  })


  const tokenURIs = await multicallv2(erc721ABI, uriCalls, { requireSuccess: false })

  const items = tokenIds.map((id, i) => {
    return {
      id: id.toString(),
      address,
      owner: account,
      tokenURI: tokenURIs[i] ? tokenURIs[i][0] : null
    }
  })

  return {
    ...nft,
    items,
    itemsTotalLength: balanceOf.toNumber(),
    itemsCurrentLength: count
  }
}

export const fetchNftMetadata = async (uri: string) => {
  const metadata = await fetchTokenUriData(uri)
  return metadata
}


export default fetchUserNfts

