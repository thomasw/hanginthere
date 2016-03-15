export const UPDATE_ACCOUNTS = 'UPDATE_ACCOUNTS'
export const ACTIVATE_ACCOUNT = 'ACTIVATE_ACCOUNT'
export const SET_LOADING = 'SET_LOADING'
export const CONTACT_UPDATE = 'CONTACT_UPDATE'
export const SET_UNREAD_COUNTS = 'SET_UNREAD_COUNTS'

export function updateAccounts (accounts) {
  accounts = accounts.map((account) => {
    account.unreadCount = 0
    return account
  })
  return { type: UPDATE_ACCOUNTS, accounts }
}

export function activateAccount(account) {
  return { type: ACTIVATE_ACCOUNT, account: account.id }
}

export function setLoading() {
  return { type: SET_LOADING }
}

export function updateContact(contact) {
  return { type: CONTACT_UPDATE, contact }
}

export function setUnreadCounts(unreadCounts) {
  return { type: SET_UNREAD_COUNTS, unreadCounts}
}
