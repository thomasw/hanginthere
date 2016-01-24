import { combineReducers } from 'redux'
import { UPDATE_ACCOUNTS } from './actions'

function accounts (state = [], action) {
  switch (action.type) {
    case UPDATE_ACCOUNTS:
      if (action.accounts.length < state.length) {
        return action.accounts
      }

      // Google always adds new accounts to the bottm, so we can get always
      // with ignoring however many items are already in the accounts list.
      return [].concat(state, action.accounts.slice(state.length))
    default:
      return state
  }
}

export default combineReducers({
  'accounts': accounts
})