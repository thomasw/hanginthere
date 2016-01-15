'use strict';

const path = require('path');
const _ = require('lodash');

const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;

class ChatWindow extends BrowserWindow {

  constructor(settings) {
    var defaults = {
      minWidth: 1024,
      minHeight: 768,
      width: 1500,
      height: 768,
      title: 'HangInThere',
      icon: path.join(__dirname, '../img/icon.png'),
      titleBarStyle: 'hidden-inset',
      show: false
    };

    super(_.assign({}, defaults, settings));

    this.loadURL('file://' + path.join(__dirname, 'main.html'));

    this.on('close', this.handleClose.bind(this));
  }

  handleClose(e) {
    console.log('Close request for chat window. Hiding instead.');
    e.preventDefault();

    this.hide();
  }
}

module.exports = ChatWindow;
