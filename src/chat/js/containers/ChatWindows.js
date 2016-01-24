import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import ChatList from '../components/ChatList'
import Chat from '../components/Chat'

class ChatWindows extends Component {
  render () {
    const { accounts } = this.props
    return (<ChatList accounts={accounts} />)
  }
}

ChatWindows.propTypes = {
  accounts: PropTypes.arrayOf(PropTypes.shape(Chat.propTypes).isRequired)
              .isRequired
}

function selectAccounts (state) {
  return { accounts: state.accounts }
}

export default connect(selectAccounts)(ChatWindows)
