'use strict';

const BrowserWindow = require('browser-window');
const _ = require('lodash');
const path = require('path');

class LoginWindow extends BrowserWindow {

  constructor(settings) {

    var defaults = {
      minWidth: 800,
      minHeight: 768,
      width: 800,
      height: 768,
      title: 'HangInThere',
      icon: path.join(__dirname, '../img/icon.png'),
      titleBarStyle: 'hidden-inset'
    };

    super(_.assign({}, defaults, settings));

    this.success_url = 'https://hangouts.google.com/';

    this.loadURL(
      'https://accounts.google.com/AddSession' +
      '?service=talk&continue=https://hangouts.google.com/#identifier'
    );

    this.webContents.on('will-navigate', this._LoginNavCheck.bind(this));
    this.webContents.on(
      'did-get-redirect-request', this._LoginRedirectCheck.bind(this));

  }

  _LoginNavCheck(e, url) {
    console.log('Login window navigating:', url);

    if(!url.startsWith(this.success_url)) {
      return;
    }

    this.loginSuccess();
  }

  _LoginRedirectCheck(
      e, oldURL, newURL, mainFrame,httpResponseCode, requestMethod, referrer,
      headers)
  {
    console.log(`LoginWindow redirecting from ${oldURL} to ${newURL}.`);

    if(!mainFrame || !newURL.startsWith(this.success_url)) { return; }

    this.loginSuccess();
  }

  loginSuccess() {
    console.log('Account added succesfully.');

    this.destroy();
  }

}

module.exports = LoginWindow;
