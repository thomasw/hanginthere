import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import AccountSelector from './containers/AccountSelector'
import ChatWindows from './containers/ChatWindows'
import Loader from './containers/Loader'
import chatAppReducer from './reducers'
import { updateAccounts, activateAccount, setLoading } from './actions'

/*global ipcRenderer:false */

let store = createStore(chatAppReducer)
let selectorContainer = document.getElementById('account-selector')
let chatContainer = document.getElementById('chat-windows')
let loaderContainer = document.getElementById('loader-wrapper')

const stateLogger = () => {
  console.log('State update:', store.getState())
};

stateLogger()
store.subscribe(stateLogger)

ipcRenderer.on('accounts-update', (e, accounts) => {
  let selectedAccount = store.getState().selectedAccount;
  let newFirstAccount = (selectedAccount === null) && accounts[0];

  accounts.length == 0 && store.dispatch(setLoading())

  store.dispatch(updateAccounts(accounts))
  newFirstAccount && store.dispatch(activateAccount(newFirstAccount))
})

render(
  <Provider store={store}><Loader /></Provider>, loaderContainer)
render(
  <Provider store={store}><AccountSelector /></Provider>, selectorContainer)
render(
  <Provider store={store}><ChatWindows /></Provider>, chatContainer)

ipcRenderer.send('request-accounts')
