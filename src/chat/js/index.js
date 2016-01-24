import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import AccountSelector from './containers/AccountSelector'
import chatAppReducer from './reducers'
import { updateAccounts } from './actions'

/*global ipcRenderer:false */

let store = createStore(chatAppReducer)
let selectorContainer = document.getElementById('account-selector')

const stateLogger = () => {
  console.log('State update:', store.getState())
};

stateLogger()
store.subscribe(stateLogger)

ipcRenderer.on('accounts-update', (e, accounts) => {
  store.dispatch(updateAccounts(accounts))
})

render(
  <Provider store={store}><AccountSelector /></Provider>, selectorContainer)

ipcRenderer.send('request-accounts')
