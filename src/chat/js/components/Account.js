import React, { Component, PropTypes } from 'react'

export default class Account extends Component {
  render () {
    return (
        <li>
          <a href='#account-{this.props.id}'>
          <img src={this.props.icon} />
          {this.props.name}{' - '}{this.props.email}
        </a>
      </li>)
  }
}

Account.propTypes = {
  email: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
}
