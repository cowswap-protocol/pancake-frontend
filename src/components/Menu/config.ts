import { MenuEntry } from 'cowswap-uikit'
import { ContextApi } from 'contexts/Localization/types'

const config: (t: ContextApi['t']) => MenuEntry[] = (t) => [
  {
    label: t('Home'),
    icon: 'HomeIcon',
    href: '/',
  },
  {
    label: t('Trade'),
    icon: 'TradeIcon',
    href: '/',
  },
  {
    label: t('Liquidity'),
    icon: 'PoolIcon',
    href: '/',
  },
  // {
  //   label: t('Trade'),
  //   icon: 'TradeIcon',
  //   items: [
  //     {
  //       label: t('Exchange'),
  //       href: 'https://exchange.pancakeswap.finance/#/swap',
  //     },
  //     {
  //       label: t('Liquidity'),
  //       href: 'https://exchange.pancakeswap.finance/#/pool',
  //     },
  //   ],
  // },
  {
    label: t('Farms'),
    icon: 'FarmIcon',
    href: '/farms',
  },
  {
    label: t('Pools'),
    icon: 'PoolIcon',
    href: '/pools',
  },
  {
    label: 'POT',
    icon: 'FarmIcon',
    href: '/pools',
  },
  // {
  //   label: t('Prediction (BETA)'),
  //   icon: 'PredictionsIcon',
  //   href: '/prediction',
  // },
  // {
  //   label: t('Lottery'),
  //   icon: 'TicketIcon',
  //   href: '/lottery',
  // },
  // {
  //   label: t('Collectibles'),
  //   icon: 'NftIcon',
  //   href: '/collectibles',
  // },
  // {
  //   label: t('Team Battle'),
  //   icon: 'TeamBattleIcon',
  //   href: '/competition',
  // },
  // {
  //   label: t('Teams & Profile'),
  //   icon: 'GroupsIcon',
  //   items: [
  //     {
  //       label: t('Leaderboard'),
  //       href: '/teams',
  //     },
  //     {
  //       label: t('Task Center'),
  //       href: '/profile/tasks',
  //     },
  //     {
  //       label: t('Your Profile'),
  //       href: '/profile',
  //     },
  //   ],
  // },
  // {
  //   label: t('Info'),
  //   icon: 'InfoIcon',
  //   href: 'https://pancakeswap.info',
  //   status: {
  //     text: t('New').toLocaleUpperCase(),
  //     color: 'success',
  //   },
  // },
  // {
  //   label: t('IFO'),
  //   icon: 'IfoIcon',
  //   href: '/ifo',
  // },
  {
    label: t('More'),
    icon: 'MoreIcon',
    items: [
      
      {
        label: t('Github'),
        href: 'https://github.com/pancakeswap',
      },
      // {
      //   label: t('Docs'),
      //   href: 'https://docs.pancakeswap.finance',
      // },
      // {
      //   label: t('Blog'),
      //   href: 'https://pancakeswap.medium.com',
      // },
      // {
      //   label: t('Merch'),
      //   href: 'https://pancakeswap.creator-spring.com/',
      // },
    ],
  },
]

export default config
