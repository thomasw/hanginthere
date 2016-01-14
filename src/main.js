'use strict';
const electron = require('electron');
const app = electron.app;
const ipcMain = electron.ipcMain;
const session = electron.session;

const AccountManager = require('./auth/accounts');
const LoginWindow = require('./auth/login-window');
const WindowManager = require('./window-manager');
const DockNotifier = require('./dock-notifier');

const MenuBuilder = require('./menus');
const bindWindowEvents = require('./window-events');


let accountManager = new AccountManager();
let windowManager = new WindowManager();
let dockNotifier = new DockNotifier({
  dock: app.dock,
  windowManager: windowManager
});
let menuBuilder = new MenuBuilder({
  appName: app.getName(),
  Menu: electron.Menu
});
let accounts = [];

function reloadWindow(menuItem, activeWindow) {
  activeWindow && activeWindow.reload();
}

function fullScreenWindow(menuItem, activeWindow) {
  activeWindow && activeWindow.setFullScreen(!activeWindow.isFullScreen());
}

function toggleDevTools(menuItem, activeWindow) {
  activeWindow && activeWindow.toggleDevTools();
}

function clearSessionDataAndQuit() {
  session.defaultSession.clearStorageData(()=>{
    app.quit();
  });
}

function init() {
  accountManager.getAccounts().then((data) => {
    console.log('Authenticated accounts:', data);

    accounts = data;
  }).then(() => {
    if (accounts.length === 0) {
      new LoginWindow();
    }
  }).catch((error) => {
    console.log('Unable to retrieve account data.', error);
    app.quit();
  });
}

menuBuilder.on('quit-clicked', app.quit);
menuBuilder.on('reload-clicked', reloadWindow);
menuBuilder.on('full_screen-clicked', fullScreenWindow);
menuBuilder.on('dev_tools-clicked', toggleDevTools);
menuBuilder.on('next_window-clicked',
  windowManager.activateNextWindow.bind(windowManager));
menuBuilder.on('log_out-clicked', clearSessionDataAndQuit);

app.on('ready', () => { electron.Menu.setApplicationMenu(menuBuilder.menu); });
app.on('ready', init);
app.on('window-all-closed', () => {}); // Prevent the default (app closes)

app.on('browser-window-created', (e, win) => { windowManager.addWindow(win); });
app.on('browser-window-created', (e, win) => { bindWindowEvents(win); });

app.on('browser-window-focus', dockNotifier.resetDock.bind(dockNotifier));
app.on('activate', dockNotifier.resetDock.bind(dockNotifier));

ipcMain.on('message-received', dockNotifier.messageReceived.bind(dockNotifier));
