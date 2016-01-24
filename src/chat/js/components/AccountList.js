import React, { Component, PropTypes } from 'react'
import Account from './Account'
import AddAccount from './AddAccount'

export default class AccountList extends Component {
  render () {
    var accountNodes = this.props.accounts.map((account, index) => {
      return (
        <Account email={account.email}
            icon={account.icon}
            id={account.id}
            key={account.id}
            name={account.name}
        />)
    })

    return (
      <ul>
      {accountNodes}
        <li><AddAccount /></li>
      </ul>
    )
  }
}

AccountList.propTypes = {
  accounts: PropTypes.arrayOf(PropTypes.shape(Account.propTypes).isRequired)
              .isRequired
}
