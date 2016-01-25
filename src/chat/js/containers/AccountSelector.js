import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import AccountList from '../components/AccountList'
import { activateAccount } from '../actions'

class AccountSelector extends Component {
  render () {
    const { accounts, selectedAccount, dispatch } = this.props

    var handleAccountSelect = (id) => {
      dispatch(activateAccount({id}))
    }

    return (
      <AccountList accounts={accounts}
          onAccountSelect={handleAccountSelect}
          selectedAccount={selectedAccount}
      />
    )
  }
}

AccountSelector.propTypes = {
  accounts: AccountList.propTypes.accounts,
  dispatch: PropTypes.func.isRequired,
  selectedAccount: PropTypes.string
}

function selectAccounts (state) {
  return state
}

export default connect(selectAccounts)(AccountSelector)
