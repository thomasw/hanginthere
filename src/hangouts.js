'use strict';

const fs = require('fs');
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
        preload: path.join(__dirname, 'hangouts-preload.js')
      },
      titleBarStyle: 'hidden-inset'
    };

    super(_.assign({}, defaults, settings));

    this.loadURL('https://hangouts.google.com/');
    this.cssOverrides = path.join(__dirname, 'hangouts-injected.css');

    this.webContents.on('dom-ready', function() {
      this.injectCSS(this.cssOverrides);
    }.bind(this));
  }

  injectCSS(css_file) {
    var cssInjector = function(err, data) {
      this.webContents.insertCSS(data);
    }.bind(this);
    fs.readFile(css_file, 'utf8', cssInjector);
  }

}

module.exports = HangoutsWindow;
