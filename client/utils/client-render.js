// client render
import React from 'react'
import { Provider } from 'react-redux'
import {createStore, applyMiddleware, combineReducers} from 'redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import {reducer as formReducer} from 'redux-form';

export default function clientRender(Container, reducers) {

  reducers.form = formReducer

  const reducer = combineReducers(reducers);

  const middleware = [thunkMiddleware];

  if (process.env.ENVIRONMENT !== 'production') {
    middleware.push(createLogger());
  }

	const createStoreWithMiddleware = applyMiddleware(
    ...middleware
	)(createStore)


	const clientStore = createStoreWithMiddleware(reducer)

  class RootComponent extends React.Component {
    render() {
      return (
        <Provider store={clientStore}>
          <Container />
        </Provider>
      )
    }
  }

	return RootComponent

}
