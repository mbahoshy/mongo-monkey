import React from 'react'
import ReactDOM from 'react-dom'
import {Router, RoutingContext, IndexRoute, Route, Link} from 'react-router'
import { connect } from 'react-redux'
import history from 'route-history'
import Home from 'routes/home/home-root'


import ClientRender from 'utils/client-render'

import 'css/styles'

import appStore from 'reducers/reducer-app';
import notificationStore from 'reducers/reducer-notifications';
import loadingStore from 'reducers/reducer-loading';

function mapStateToProps(state) {
  return state
}

const routes = (
  <Route path="/" component={App} history={history}>
    <IndexRoute component={Home} />,
  </Route>

)

class App extends React.Component{
  render () {
    return (
      <div>
        <Router routes={routes} />

        <footer>
          <div className="container-fluid">
            Footer.
          </div>
        </footer>
      </div>
    )
  }
}

const Container = connect(mapStateToProps)(App)

const RouteContainer = ClientRender(Container, { appStore, notificationStore, loadingStore })

ReactDOM.render(<RouteContainer />, document.getElementById('app'))
