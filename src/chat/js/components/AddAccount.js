import React, { Component } from 'react'

/*global ipcRenderer:false */

export default class AddAccount extends Component {

  handleClick (e) {
    ipcRenderer.send('add-account')
  }

  render () {
    return (<button onClick={this.handleClick}>{'Add account'}</button>)
  }
}
