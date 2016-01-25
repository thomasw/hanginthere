export const UPDATE_ACCOUNTS = 'UPDATE_ACCOUNTS'
export const ACTIVATE_ACCOUNT = 'ACTIVATE_ACCOUNT'
export const SET_LOADING = 'SET_LOADING'

export function updateAccounts (accounts) {
  return { type: UPDATE_ACCOUNTS, accounts }
}

export function activateAccount(account) {
  return { type: ACTIVATE_ACCOUNT, account: account.id }
}

export function setLoading() {
  return { type: SET_LOADING }
}
