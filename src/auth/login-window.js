'use strict';

const {BrowserWindow} = require('electron');
const _ = require('lodash');
const path = require('path');


const _defaults = {
  minWidth: 800,
  minHeight: 800,
  width: 800,
  height: 800,
  title: 'HangInThere',
  icon: path.join(__dirname, '../img/icon.png'),
  titleBarStyle: 'hidden-inset'
};


function _LoginNavCheck(e, url) {
  console.log('Login window navigating:', url);

  if(!url.startsWith(this.success_url)) {
    return;
  }

  this.loginSuccess();
}

function _LoginRedirectCheck(e, oldURL, newURL, mainFrame) {
  console.log(`LoginWindow redirecting from ${oldURL} to ${newURL}.`);

  if(!mainFrame || !newURL.startsWith(this.success_url)) { return; }

  this.loginSuccess();
}

function _loginSuccess() {
  console.log('Account added succesfully.');

  this.emit('account-added');

  this.destroy();
}

function createLoginWindow(settings) {

  let window = new BrowserWindow(_.assign({}, _defaults, settings));

  window.success_url = 'https://hangouts.google.com/';

  window.loadURL(
    'https://accounts.google.com/AddSession' +
    '?service=talk&continue=https://hangouts.google.com/#identifier'
  );

  window._LoginRedirectCheck = _LoginRedirectCheck.bind(window);
  window._LoginNavCheck = _LoginNavCheck.bind(window);
  window.loginSuccess = _loginSuccess.bind(window);

  window.webContents.on('will-navigate', window._LoginNavCheck.bind(window));
  window.webContents.on(
    'did-get-redirect-request', window._LoginRedirectCheck.bind(window));

  return window;
}

module.exports = createLoginWindow;
