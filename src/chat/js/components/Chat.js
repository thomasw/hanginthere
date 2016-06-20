import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import path from 'path'

/*global fs:false, chat_dir:false */

const videoChatURLs = [
  'https://talkgadget.google.com/', 'https://hangouts.google.com/']

function isVideoChatUrl(url) {
  return videoChatURLs.some((x) => {
    return url.startsWith(x);
  });
}

export default class Chat extends Component {

  componentDidMount() {
    let webview = ReactDOM.findDOMNode(this)

    webview.addEventListener('did-get-response-details', this.injectCss)
    webview.addEventListener('ipc-message', this.handleContactUpdate.bind(this))
    webview.addEventListener('console-message', this.logMessage)
    webview.addEventListener('will-navigate', this.handleNavigation.bind(this))
    webview.addEventListener('new-window', this.handleNavigation.bind(this))
  }

  componentWillUnmount() {
    let webview = ReactDOM.findDOMNode(this)

    webview.removeEventListener('did-get-response-details', this.injectCss)
    webview.removeEventListener('console-message', this.logMessage)
    webview.removeEventListener('ipc-message', this.handleContactUpdate)
    webview.removeEventListener('will-navigate', this.handleNavigation)
    webview.removeEventListener('new-window', this.handleNavigation)
  }

  handleContactUpdate(e) {
    let contact = e.args[0];

    if(e.channel !== 'contact-update' || !contact) { return; }

    contact.id = `${this.props.id}${contact.id}`
    contact.account = this.props.id

    this.props.onContactUpdate(contact);
  }

  handleNavigation(e) {
    const url = e.url

    console.log('BrowserWindow new window invokation attempt:', e, url, this)
    e.preventDefault()

    if(isVideoChatUrl(url)) {
      this.openWindow(url)
      return false
    }

    electron.shell.openExternal(url)
    return false
  }

  openWindow(url) {
    let win = new electron.remote.BrowserWindow({width: 800, height: 600})
    win.loadURL(url)
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
