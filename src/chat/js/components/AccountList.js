import React, { Component, PropTypes } from 'react'
import Account from './Account'
import AddAccount from './AddAccount'

export default class AccountList extends Component {
  render () {
    var accountNodes = this.props.accounts.map((account) => {
      const accountSelected = this.props.selectedAccount === account.id
      return (
        <li className={(accountSelected) ? 'selected': ''}
            key={account.id}
        >
          <Account email={account.email}
              humanizedAccelerator={account.humanizedAccelerator}
              icon={account.icon}
              id={account.id}
              name={account.name}
              onAccountSelect={this.props.onAccountSelect}
          />
        </li>)
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
  accounts: PropTypes.arrayOf(PropTypes.shape({
    email: PropTypes.string.isRequired,
    humanizedAccelerator: PropTypes.string,
    icon: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired).isRequired,
  onAccountSelect: PropTypes.func.isRequired,
  selectedAccount: PropTypes.number
}
