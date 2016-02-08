import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import ChatList from '../components/ChatList'
import { updateContact } from '../actions'

class ChatWindows extends Component {
  render () {
    const { accounts, selectedAccount, dispatch } = this.props

    let handleContactUpdate = (contact) => {
      dispatch(updateContact(contact))
    }

    return (
      <ChatList accounts={accounts}
          onContactUpdate={handleContactUpdate}
          selectedAccount={selectedAccount}
      />)
  }
}

ChatWindows.propTypes = {
  accounts: ChatList.propTypes.accounts,
  dispatch: PropTypes.func.isRequired,
  selectedAccount: PropTypes.number
}

function getState (state) {
  return state
}

export default connect(getState)(ChatWindows)
