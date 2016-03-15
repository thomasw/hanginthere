import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import AccountSelector from './containers/AccountSelector'
import ChatWindows from './containers/ChatWindows'
import Loader from './containers/Loader'
import chatAppReducer from './reducers'
import {
  updateAccounts, activateAccount, setLoading, setUnreadCounts
} from './actions'
import { sum, isEqual } from 'lodash';

/*global ipcRenderer:false */

let store = createStore(chatAppReducer)
let selectorContainer = document.getElementById('account-selector')
let chatContainer = document.getElementById('chat-windows')
let loaderContainer = document.getElementById('loader-wrapper')

const stateLogger = () => {
  console.log('State update:', store.getState())
};

const updateUnreadCounts = () => {
  let state = store.getState()
  let accounts = state.accounts
  let contacts = state.contacts
  let oldUnreadCounts = accounts.map((acc) => { return acc.unreadCount })
  let unreadCounts = new Array(accounts.length).fill(0)

  Object.keys(contacts).forEach((key) => {
    let contact = contacts[key]
    let account = contact.account

    unreadCounts[account] = unreadCounts[account] + contact.unreadCount
  });

  if(!isEqual(unreadCounts, oldUnreadCounts)) {
    store.dispatch(setUnreadCounts(unreadCounts))
    ipcRenderer.send('update-dock-count', sum(unreadCounts))
  }
}

stateLogger()

store.subscribe(stateLogger)
store.subscribe(updateUnreadCounts)

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
