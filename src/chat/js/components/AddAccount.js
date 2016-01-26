import React, { Component } from 'react'

/*global ipcRenderer:false */

export default class AddAccount extends Component {

  handleClick () {
    ipcRenderer.send('add-account')
  }

  render () {
    return (
      <button className={'add-account'}
          onClick={this.handleClick}
      >
        <span>{'+'}</span>
      </button>)
  }
}
