'use strict';
const electron = require('electron');
const app = electron.app;

const HangoutsWindow = require('./hangouts/hangouts-window.js');
const WindowManager = require('./window-manager.js');

const MenuBuilder = require('./menus.js');
const bindWindowEvents = require('./window-events');

let windowManager = new WindowManager();
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
  new HangoutsWindow();
}

function track_window(e, window) {
  bindWindowEvents(window);
  windowManager.addWindow(window);
}

function windowsAllClosed() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
}

menuBuilder.on('new_window-clicked', initialize_hangouts_window);
menuBuilder.on('quit-clicked', app.quit);
menuBuilder.on('reload-clicked', reload_window);
menuBuilder.on('full_screen-clicked', full_screen_window);
menuBuilder.on('dev_tools-clicked', toggle_dev_tools_for_window);

app.on('ready', initialize_hangouts_window);
app.on('ready', initialize_menu);
app.on('browser-window-created', track_window);
app.on('window-all-closed', windowsAllClosed);
