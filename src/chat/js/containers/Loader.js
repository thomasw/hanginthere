import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

class Loader extends Component {
  render () {
    const { selectedAccount } = this.props
    return (
      <section className={(selectedAccount === null) ? 'visible': 'hidden'}
          id="loader"
      >
        <img src="../img/icon.png" />
        <p>{'Connecting...'}</p>
      </section>)
  }
}

Loader.propTypes = {
  selectedAccount: PropTypes.string
}

function getSelectedAccount(state) {
  return { selectedAccount: state.selectedAccount }
}

export default connect(getSelectedAccount)(Loader)
