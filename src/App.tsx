import React, { lazy } from 'react'
import { Router, Redirect, Route, Switch } from 'react-router-dom'
import { ResetCSS } from 'cowswap-uikit'
import BigNumber from 'bignumber.js'
import useEagerConnect from 'hooks/useEagerConnect'
import { usePollCoreFarmData, useFetchProfile, usePollBlockNumber, usePollPricesData } from 'state/hooks'
import GlobalStyle from './style/Global'
import Menu from './components/Menu'
import SuspenseWithChunkError from './components/SuspenseWithChunkError'
import ToastListener from './components/ToastListener'
import PageLoader from './components/PageLoader'
import EasterEgg from './components/EasterEgg'
// import Pools from './views/Pools'
import history from './routerHistory'


// Route-based code splitting
// Only pool is included in the main bundle because of it's the most visited page
const Home = lazy(() => import('./views/Home'))
const Farms = lazy(() => import('./views/Farms'))
const Pots = lazy(() => import('./views/Pots'))

const Cowboy = lazy(() => import('./views/Cowboy'))
// const Ifos = lazy(() => import('./views/Ifos'))
const NotFound = lazy(() => import('./views/NotFound'))
const Collectibles = lazy(() => import('./views/Collectibles'))
const Marketplace = lazy(() => import('./views/Marketplace'))
const NftOrder = lazy(() => import('./views/Marketplace/Order'))
const CreateNftOrder = lazy(() => import('./views/Marketplace/Create'))
const MyNftOrders = lazy(() => import('./views/Marketplace/MyOrders'))
const MyNfts = lazy(() => import('./views/Marketplace/MyNfts'))
const Sell = lazy(() => import('./views/Marketplace/Sell'))
// const Teams = lazy(() => import('./views/Teams'))
// const Team = lazy(() => import('./views/Teams/Team'))
// const Profile = lazy(() => import('./views/Profile'))
// const TradingCompetition = lazy(() => import('./views/TradingCompetition'))
// const Predictions = lazy(() => import('./views/Predictions'))

// This config is required for number formatting
BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

const App: React.FC = () => {
  usePollBlockNumber()
  useEagerConnect()
  useFetchProfile()
  usePollCoreFarmData()
  usePollPricesData()

  return (
    <Router history={history}>
      <ResetCSS />
      <GlobalStyle />
      <Menu>
        <SuspenseWithChunkError fallback={<PageLoader />}>
          <Switch>
            <Route path="/" exact>
              <Farms />
            </Route>
            <Route path="/farms">
              <Farms />
            </Route>
            
            <Route path="/pots">
              <Pots />
            </Route>

            <Route path="/cowboy">
              <Cowboy />
            </Route>

            <Route path="/marketplace" exact>
              <Marketplace />
            </Route>

            <Route path="/marketplace/order/:id" >
              <NftOrder />
            </Route>

            <Route path="/marketplace/create" exact >
              <Sell />
            </Route>
            <Route path="/marketplace/my-orders" >
              <MyNftOrders />
            </Route>
            <Route path="/marketplace/my-nfts" >
              <MyNfts />
            </Route>

            {/* 404 */}
            <Route component={NotFound} />
          </Switch>
        </SuspenseWithChunkError>
      </Menu>
      <EasterEgg iterations={2} />
      <ToastListener />
    </Router>
  )
}

export default React.memo(App)
