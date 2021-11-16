import React from 'react'
import ReactDOM from 'react-dom'
import store from './store/store'
import RouterReducer from './components/RouterReducer'
import PageNotfound from './components/404'
import { Provider } from 'react-redux'
import { createBrowserHistory } from 'history'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import './styles/index.css'

const history = createBrowserHistory()

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Switch>
        <Route path='/cart' component={RouterReducer} />
        <Route path='/error' component={PageNotfound} />
        <Route path='/:categoryName/add-to-cart-from-plp' component={RouterReducer} />
        <Route path='/:categoryName/:productId' component={RouterReducer} />
        <Route path='/:categoryName' component={RouterReducer}/>
        <Route path='/' component={RouterReducer} />
      </Switch>
    </Router>
  </Provider>,
  document.getElementById('root')
);