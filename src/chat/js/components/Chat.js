import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import path from 'path';

/*global fs:false, chat_dir:false */

export default class Chat extends Component {

  componentDidMount() {
    let webview = ReactDOM.findDOMNode(this);
    webview.addEventListener('did-get-response-details', this.injectCss);
    webview.send('hello');
    webview.addEventListener('ipc-message', (e) => {
      console.log(e.srcElement.id, e.args[0]);
    });
    webview.addEventListener('console-message', this.logMessage);
  }

  componentWillUnmount() {
    this.removeEventListener('did-get-response-details', this.injectCss);
  }

  injectCss(e) {
    let cssPath = path.join(chat_dir, 'css/injected.css')
    fs.readFile(cssPath, 'utf8', (err, data) => {
      e.srcElement.insertCSS(data)
    })
  }

  logMessage(e) {
    console.log(
      `Chat WebView (${e.srcElement.id}):`, e.level, e.message);
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
  id: PropTypes.number.isRequired
}
