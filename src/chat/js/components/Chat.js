import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import path from 'path';

/*global fs:false, chat_dir:false */

export default class Chat extends Component {

  componentDidMount() {
    let webview = ReactDOM.findDOMNode(this)

    webview.addEventListener('did-get-response-details', this.injectCss)
    webview.addEventListener('ipc-message', this.handleContactUpdate.bind(this))
    webview.addEventListener('console-message', this.logMessage)
  }

  componentWillUnmount() {
    let webview = ReactDOM.findDOMNode(this)

    webview.removeEventListener('did-get-response-details', this.injectCss)
    webview.removeEventListener('console-message', this.logMessage)
    webview.removeEventListener('ipc-message', this.handleContactUpdate)
  }

  handleContactUpdate(e) {
    let contact = e.args[0];

    if(e.channel !== 'contact-update' || !contact) { return; }

    contact.id = `${this.props.id}${contact.id}`
    contact.account = this.props.id

    this.props.onContactUpdate(contact);
  }

  injectCss(e) {
    let cssPath = path.join(chat_dir, 'css/injected.css')

    fs.readFile(cssPath, 'utf8', (err, data) => {
      e.srcElement.insertCSS(data)
    })
  }

  logMessage(e) {
    console.log(`Chat WebView (${e.srcElement.id}):`, e.level, e.message);
  }

  render () {
    const hangoutUrl = `https://hangouts.google.com?authuser=${this.props.id}`
    const chatId = `chat-${this.props.id}`

    return (
      <webview id={chatId}
          preload="injected_js/preload.js"
          src={hangoutUrl}
      />)
  }
}

Chat.propTypes = {
  id: PropTypes.number.isRequired,
  onContactUpdate: PropTypes.func.isRequired
}
