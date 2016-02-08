import React, { Component, PropTypes } from 'react'

export default class Account extends Component {
  render () {
    let handleClick = () => {
      this.props.onAccountSelect(this.props.id)
    }

    let countClass = `unreadCount${this.props.unreadCount ? ' ' : ' hidden'}`

    return (
      <button href='#account-{this.props.id}'
          onClick={handleClick}
      >
        <img src={this.props.icon} />
        <div className={'account-name'}>
          {this.props.name}{' - '}{this.props.email}
        </div>
        <div className={countClass}>{this.props.unreadCount}</div>
        <div className={'shortcut'}>{this.props.humanizedAccelerator}</div>
      </button>
    )
  }
}

Account.propTypes = {
  email: PropTypes.string.isRequired,
  humanizedAccelerator: PropTypes.string,
  icon: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  onAccountSelect: PropTypes.func.isRequired,
  unreadCount: PropTypes.number.isRequired
}
