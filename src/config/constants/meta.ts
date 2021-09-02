import { ContextApi } from 'contexts/Localization/types'
import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'Cowswap',
  description:
    'faster than PancakeSwap',
  image: 'https://cowswap.org/cowb_320.png',
}

export const getCustomMeta = (path: string, t: ContextApi['t']): PageMeta => {
  switch (path) {
    case '/':
      return {
        title: `${t('Home')} | ${t('Cowswap')}`,
      }
    case '/competition':
      return {
        title: `${t('Trading Battle')} | ${t('Cowswap')}`,
      }
    case '/prediction':
      return {
        title: `${t('Prediction')} | ${t('Cowswap')}`,
      }
    case '/farms':
      return {
        title: `${t('Farms')} | ${t('Cowswap')}`,
      }
    case '/pools':
      return {
        title: `${t('Pools')} | ${t('Cowswap')}`,
      }
    case '/lottery':
      return {
        title: `${t('Lottery')} | ${t('Cowswap')}`,
      }
    case '/collectibles':
      return {
        title: `${t('Collectibles')} | ${t('Cowswap')}`,
      }
    case '/ifo':
      return {
        title: `${t('Initial Farm Offering')} | ${t('Cowswap')}`,
      }
    case '/teams':
      return {
        title: `${t('Leaderboard')} | ${t('Cowswap')}`,
      }
    case '/profile/tasks':
      return {
        title: `${t('Task Center')} | ${t('Cowswap')}`,
      }
    case '/profile':
      return {
        title: `${t('Your Profile')} | ${t('Cowswap')}`,
      }
    case '/cowboy':
      return {
        title: `${t('Cowboy')} | ${t('Cowswap')}`,
      }
    case '/pots':
      return {
        title: `${t('Proof of Trade')} | ${t('Cowswap')}`,
      }
    default:
      return null
  }
}
