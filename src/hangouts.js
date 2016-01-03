'use strict';

const path = require('path');
const _ = require('lodash');

const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;

class HangoutsWindow extends BrowserWindow {

  constructor(settings) {
    var defaults = {
      minWidth: 1024,
      minHeight: 768,
      width: 1500,
      height: 768,
      title: 'HangInThere',
      icon: path.join(__dirname, 'img/icon.png'),
      webPreferences: {
        preload: path.join(__dirname, 'spellcheck.js')
      }
    };

    super(_.assign({}, defaults, settings));

    this.loadURL('https://hangouts.google.com/');
  }

}

module.exports = HangoutsWindow;
