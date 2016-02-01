import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import ChatList from '../components/ChatList'

class ChatWindows extends Component {
  render () {
    const { accounts, selectedAccount } = this.props
    return (
      <ChatList accounts={accounts}
          selectedAccount={selectedAccount}
      />)
  }
}

ChatWindows.propTypes = {
  accounts: ChatList.propTypes.accounts,
  selectedAccount: PropTypes.number
}

function getState (state) {
  return state
}

export default connect(getState)(ChatWindows)
