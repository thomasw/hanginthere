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

ipcRenderer.on('account-selection', (e, account) => {
  store.dispatch(activateAccount(account));
});

ipcRenderer.on('previous-account', () => {
  let state = store.getState();
  let nextAccount = state.accounts.slice(state.selectedAccount - 1)[0];

  if (state.selectedAccount === null || state.accounts.length === 0) {
    return;
  }

  store.dispatch(activateAccount(nextAccount));
});

ipcRenderer.on('next-account', () => {
  let state = store.getState();
  let nextAccountIndex = (state.selectedAccount + 1) % state.accounts.length
  let nextAccount = state.accounts[nextAccountIndex];

  if (state.selectedAccount === null || state.accounts.length === 0) {
    return;
  }

  store.dispatch(activateAccount(nextAccount));
});

render(
  <Provider store={store}><Loader /></Provider>, loaderContainer)
render(
  <Provider store={store}><AccountSelector /></Provider>, selectorContainer)
render(
  <Provider store={store}><ChatWindows /></Provider>, chatContainer)

ipcRenderer.send('request-accounts')
