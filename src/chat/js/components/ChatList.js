import React, { Component, PropTypes } from 'react'
import Chat from './Chat'

export default class ChatList extends Component {
  render () {
    var accountNodes = this.props.accounts.map((account) => {
      const accountSelected = account.id === this.props.selectedAccount;
      const className = accountSelected ? 'selected' : '';

      return (
        <li className={className}
            key={account.id}
        >
          <Chat id={account.id}
              selected={account.id === this.props.selectedAccount}
          />
        </li>)
    })

    return (<ul>{accountNodes}</ul>)
  }
}

ChatList.propTypes = {
  accounts: PropTypes.arrayOf(
    PropTypes.shape(Chat.PropTypes).isRequired).isRequired,
  selectedAccount: PropTypes.number
}
