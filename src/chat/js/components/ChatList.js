import React, { Component, PropTypes } from 'react'
import Chat from './Chat'

export default class ChatList extends Component {
  render () {
    var accountNodes = this.props.accounts.map((account) => {
      return (
        <Chat id={account.id}
            key={account.id}
        />)
    })

    return (<div>{accountNodes}</div>)
  }
}

ChatList.propTypes = {
  accounts: PropTypes.arrayOf(PropTypes.shape(Chat.propTypes).isRequired)
              .isRequired
}
