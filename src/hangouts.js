'use strict';

const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;
const _ = require('lodash');

class HangoutsWindow extends BrowserWindow {

  constructor(settings) {
    var defaults = {
      minWidth: 1024,
      minHeight: 768,
      width: 1500,
      height: 768,
      title: 'HangInThere',
      icon: 'file://'+ __dirname + '/img/icon.png'
    };

    super(_.assign({}, defaults, settings));

    this.loadURL('file://' + __dirname + '/index.html');

    this.webContents.on("will-navigate", function(e) { e.preventDefault(); });
  }

}

module.exports = HangoutsWindow;
