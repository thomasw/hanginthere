'use strict';
const electron = require('electron');
const app = electron.app;

const HangoutsWindow = require('./hangouts.js');
const WindowManager = require('./windows.js');

const MenuBuilder = require('./menus.js');

let windowManager = new WindowManager({app: app});
let menuBuilder = new MenuBuilder({menu: electron.Menu})

function initialize_hangouts_window() {
  windowManager.addWindow(new HangoutsWindow());
}

function initialize_menu() {
  var menu = menuBuilder.build_menu();
  electron.Menu.setApplicationMenu(menu);
}

app.on('ready', initialize_hangouts_window);
app.on('ready', initialize_menu);
