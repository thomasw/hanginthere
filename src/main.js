'use strict';
const electron = require('electron');
const app = electron.app;

const HangoutsWindow = require('./hangouts.js');
const WindowManager = require('./windows.js');

let windowManager = new WindowManager({app: app});

function initialize_hangouts_window() {
  windowManager.addWindow(new HangoutsWindow());
}

app.on('ready', initialize_hangouts_window);
