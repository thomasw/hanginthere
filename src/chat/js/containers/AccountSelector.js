import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import AccountList from '../components/AccountList'
import Account from '../components/Account'

class AccountSelector extends Component {
  render () {
    const { accounts } = this.props
    return (<AccountList accounts={accounts} />)
  }
}

AccountSelector.propTypes = {
  accounts: PropTypes.arrayOf(PropTypes.shape(Account.propTypes).isRequired)
              .isRequired
}

function selectAccounts (state) {
  return { accounts: state.accounts }
}

export default connect(selectAccounts)(AccountSelector)
