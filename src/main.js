'use strict';
const electron = require('electron');
const app = electron.app;

const HangoutsWindow = require('./hangouts.js');
const WindowManager = require('./windows.js');

const MenuBuilder = require('./menus.js');

let windowManager = new WindowManager({app: app});
let menuBuilder = new MenuBuilder({
  appName: app.getName(),
  Menu: electron.Menu
});

function reload_window(menuItem, activeWindow) {
  if (activeWindow) {
    activeWindow.reload();
  }
}

function full_screen_window(menuItem, activeWindow) {
  if (activeWindow) {
    activeWindow.setFullScreen(!activeWindow.isFullScreen());
  }
}

function toggle_dev_tools_for_window(menuItem, activeWindow) {
  if (activeWindow) {
    activeWindow.toggleDevTools();
  }
}

function initialize_menu() {
  electron.Menu.setApplicationMenu(menuBuilder.menu);
}

function initialize_hangouts_window() {
  windowManager.addWindow(new HangoutsWindow());
}

menuBuilder.on('new_window-clicked', initialize_hangouts_window);
menuBuilder.on('quit-clicked', app.quit);
menuBuilder.on('reload-clicked', reload_window);
menuBuilder.on('full_screen-clicked', full_screen_window);
menuBuilder.on('dev_tools-clicked', toggle_dev_tools_for_window);

app.on('ready', initialize_hangouts_window);
app.on('ready', initialize_menu);
