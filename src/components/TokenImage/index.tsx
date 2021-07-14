import React from 'react'
import {
  // TokenPairImage as UIKitTokenPairImage,
  // TokenPairImageProps as UIKitTokenPairImageProps,
  TokenImage as UIKitTokenImage,
  ImageProps as UIKitImageProps,
} from 'cowswap-uikit'
import tokens from 'config/constants/tokens'
import { Token } from 'config/constants/types'
import { getAddress } from 'utils/addressHelpers'

// interface TokenImageProps extends Omit<UIKitTokenPairImageProps, 'primarySrc' | 'secondarySrc'> {
//   primaryToken: Token
//   secondaryToken: Token
// }

interface TokenImageProps extends Omit<UIKitImageProps, 'height' | 'width'> {
  token: Token
}

const getImageUrlFromToken = (token: Token) => {
  const address = getAddress(token.symbol === 'BNB' ? tokens.wbnb.address : token.address)
  return `/images/tokens/${address}.png`
}

const TokenImage: React.FC<TokenImageProps> = ({ token, ...props }) => {
  return (
    <UIKitTokenImage src={getImageUrlFromToken(token)} height={64} width={64} title={token.symbol} />
  )
}

export default TokenImage
