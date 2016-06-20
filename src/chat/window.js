'use strict';

const path = require('path');
const _ = require('lodash');

const {BrowserWindow} = require('electron');

const _defaults = {
  minWidth: 1024,
  minHeight: 768,
  width: 1500,
  height: 768,
  title: 'HangInThere',
  icon: path.join(__dirname, '../img/icon.png'),
  titleBarStyle: 'hidden-inset',
  show: false
};

function _handleClose(e) {
  if (this.closeable) { return; }

  console.log('Close request for chat window. Hiding instead.');
  e.preventDefault();
  this.hide();
}

function _makeCloseable() {
  this.closeable = true;
}

function createChatWindow(settings) {
  let window = new BrowserWindow(_.assign({}, _defaults, settings));

  window.closeable = false;
  window.handleClose = _handleClose.bind(window);
  window.makeCloseable = _makeCloseable.bind(window);

  window.loadURL('file://' + path.join(__dirname, 'main.html'));
  window.on('close', window.handleClose.bind(window));

  return window;
}

module.exports = createChatWindow;
