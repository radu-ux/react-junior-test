import React from 'react'
import ReactDOM from 'react-dom'
import store from './store/store'
import RouterReducer from './components/RouterReducer'
import { Provider } from 'react-redux'
import { fetchCurrencies } from './store/slices/currenciesSlice'
import { fetchAvailableCategories } from './store/slices/categoriesSlice'
import { createBrowserHistory } from 'history'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import './styles/index.css'

const history = createBrowserHistory()

store.dispatch(fetchCurrencies())
store.dispatch(fetchAvailableCategories())


ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter history={history}>
      <Switch>
        <Route path='/cart' component={RouterReducer} />
        <Route path='/:categoryName/:productName' component={RouterReducer} />
        <Route path='/:categoryName' component={RouterReducer}/>
        <Route path='/' component={RouterReducer} />
      </Switch>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);