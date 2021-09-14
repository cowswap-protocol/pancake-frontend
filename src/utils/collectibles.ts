import { Base64 } from 'js-base64';
import Nfts, { IPFS_GATEWAY, nftSources } from 'config/constants/nfts'
import { Nft, NftType } from 'config/constants/types'
import erc721Abi from 'config/abi/erc721.json'
import { getAddress } from './addressHelpers'
import { getErc721Contract } from './contractHelpers'
import multicall from './multicall'

/**
 * Gets the identifier key based on the nft address
 * Helpful for looking up the key when all you have is the address
 */
export const getIdentifierKeyFromAddress = (nftAddress: string) => {
  const nftSource = Object.values(nftSources).find((nftSourceEntry) => {
    const address = getAddress(nftSourceEntry.address)
    return address === nftAddress
  })

  return nftSource ? nftSource.identifierKey : null
}

/**
 * Some sources like Pancake do not return HTTP tokenURI's
 */
export const getTokenUrl = (tokenUri: string) => {
  if (tokenUri.startsWith('ipfs://')) {
    return `${IPFS_GATEWAY}/ipfs/${tokenUri.slice(6)}`
  }

  return tokenUri
}

export const getAddressByType = (type: NftType) => {
  return getAddress(nftSources[type].address)
}

export const getTokenUriData = async (nftAddress: string, tokenId: number) => {
  try {
    const contract = getErc721Contract(nftAddress)
    const tokenUri = await contract.methods.tokenURI(tokenId).call()
    const uriDataResponse = await fetch(getTokenUrl(tokenUri))

    const uriData = await uriDataResponse.json()
    uriData.image = getTokenUrl(uriData.image)
    return uriData
  } catch (error) {
    console.error('getTokenUriData', error)
    return null
  }
}

export const fetchNft = async (nftAddress: string, tokenId: number) => {
  try {
    if(!nftAddress || !tokenId) {
      return null
    }
    const calls = [
      {
        address: nftAddress,
        name: 'tokenURI',
        params: [ tokenId.toString() ]
      },
      {
        address: nftAddress,
        name: 'ownerOf',
        params: [ tokenId.toString() ]
      }
    ]
    const [ tokenUri, owner ] = await multicall(erc721Abi, calls)

    const uriDataResponse = await fetch(getTokenUrl(tokenUri[0]))

    if (!uriDataResponse.ok) {
      return null
    }

    if (!uriDataResponse.ok) {
      return null
    }

    const uriMeta = await uriDataResponse.json()
    uriMeta.image = getTokenUrl(uriMeta.image)

    const tokenInfo = {
      uriMeta,
      owner: owner[0],
      nftAddress,
      tokenId
    }
    return tokenInfo
  } catch (error) {
    console.error('fetchNft', error)
    return null
  }
}

export const fetchTokenUriData = async (uri: string) => {
  if(uri.startsWith('data:application/json;base64,')) {
    const meta = Base64.decode(uri.slice(29))
    return JSON.parse(meta)
  }
  try {
    const uriDataResponse = await fetch(getTokenUrl(uri))
    if (!uriDataResponse.ok) {
      return null
    }
    const type = uriDataResponse.headers.get('Content-Type')
    let uriData = {
      image: null
    }
    if(type.startsWith("image/")) {
      uriData.image = getTokenUrl(uri)
    } else if(type.startsWith("application/json")) {
      const jsonData = await uriDataResponse.json()
      uriData = { ...jsonData }
      uriData.image = getTokenUrl(uriData.image)
    }
    return uriData
  } catch(error) {
    console.error('fetchTokenUriData', error)
    return null
  }
}

export const getNftByTokenId = async (nftAddress: string, tokenId: number): Promise<Nft | null> => {
  const uriData = await getTokenUriData(nftAddress, tokenId)
  const identifierKey = getIdentifierKeyFromAddress(nftAddress)

  // Bail out early if we have no uriData, identifierKey, or the value does not
  // exist in the object
  if (!uriData) {
    return null
  }

  if (!identifierKey) {
    return null
  }

  if (!uriData[identifierKey]) {
    return null
  }

  return Nfts.find((nft) => {
    return uriData[identifierKey].includes(nft.identifier)
  })
}
