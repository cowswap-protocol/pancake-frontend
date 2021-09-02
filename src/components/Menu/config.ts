import { MenuEntry } from 'cowswap-uikit'
import { ContextApi } from 'contexts/Localization/types'

const config: (t: ContextApi['t']) => MenuEntry[] = (t) => [
  {
    label: t('Home'),
    icon: 'HomeIcon',
    href: 'https://cowswap.org',
  },
  {
    label: t('Trade'),
    icon: 'TradeIcon',
    href: 'https://cowswap.org/#/swap',
  },
  {
    label: t('Liquidity'),
    icon: 'LiquidityIcon',
    href: 'https://cowswap.org/#/pool',
  },
  {
    label: t('Limit Order(BETA)'),
    icon: 'LimitOrderIcon',
    href: 'https://cowswap.org/#/order',
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
    label: 'Farms (Soon)',
    icon: 'FarmIcon',
    href: '/',
  },

  {
    label: 'POTs (Soon)',
    icon: 'MiningIcon',
    href: '/',
  },
  // {
  //   label: t('Prediction (BETA)'),
  //   icon: 'PredictionsIcon',
  //   href: '/prediction',
  // },
  {
    label: t('Cowboy'),
    icon: 'CowboyIcon',
    href: '/cowboy',
    status: {
      text: t('New').toLocaleUpperCase(),
      color: 'success',
    },
  },
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
        label: t('Docs'),
        href: 'https://docs.cowswap.org/',
      },
      {
        label: t('Github'),
        href: 'https://github.com/cowswap-protocol',
      },
      {
        label: t('Twitter'),
        href: 'https://twitter.com/StakeCow',
      },
      {
        label: t('Telegram-CN'),
        href: 'https://t.me/stakecow_cn',
      },
      {
        label: t('Telegram-EN'),
        href: 'https://t.me/stakecow_en',
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
