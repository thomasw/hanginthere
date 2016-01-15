'use strict';
const electron = require('electron');
const app = electron.app;
const ipcMain = electron.ipcMain;
const session = electron.session;

const _ = require('lodash');

const AccountManager = require('./auth/accounts');
const LoginWindow = require('./auth/login-window');
const ChatWindow = require('./chat/window');
const WindowManager = require('./window-manager');
const DockNotifier = require('./dock-notifier');

const MenuBuilder = require('./menus');
const bindWindowEvents = require('./window-events');


let mainWindow;
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
let accounts;

function reloadWindow(menuItem, activeWindow) {
  activeWindow && activeWindow.reload();
}

function fullScreenWindow(menuItem, activeWindow) {
  activeWindow && activeWindow.setFullScreen(!activeWindow.isFullScreen());
}

function toggleDevTools(menuItem, activeWindow) {
  activeWindow && activeWindow.toggleDevTools();
}

function updateAccountData() {
  return accountManager.getAccounts().then((data) => {
    var updated = !_.isEqual(accounts, data);

    console.log('Authenticated accounts retrieved:', data);
    accounts = data;
    updated && app.emit('account-data-update', accounts);
  });
}

function activateMainWindow() {
  mainWindow.show();
  mainWindow.focus();
}

function addAccount() {
  new LoginWindow().on('account-added', updateAccountData);
}

function init() {
  electron.Menu.setApplicationMenu(menuBuilder.menu);

  accounts = [];
  mainWindow = new ChatWindow();

  updateAccountData().then(() => {
    if (accounts.length > 0) { return; }

    addAccount();
  }).catch((error) => {
    console.log('Unable to retrieve account data.', error);
    app.quit();
  });
}

function appReset() {
  session.defaultSession.clearStorageData(()=>{
    mainWindow && mainWindow.makeCloseable();

    windowManager.closeAll();

    init();
  });
}

menuBuilder.on('add-account', addAccount);
menuBuilder.on('quit', app.quit);
menuBuilder.on('reload', reloadWindow);
menuBuilder.on('fullscreen', fullScreenWindow);
menuBuilder.on('devtools', toggleDevTools);
menuBuilder.on('cycle-windows', () => { windowManager.activateNextWindow(); });
menuBuilder.on('logout', appReset);

app.on('before-quit', () => { mainWindow.makeCloseable(); });
app.on('ready', init);
app.on('account-data-update', activateMainWindow);
app.on('window-all-closed', () => {}); // Prevent the default (app closes)

app.on('browser-window-created', (e, win) => { windowManager.addWindow(win); });
app.on('browser-window-created', (e, win) => { bindWindowEvents(win); });

app.on('browser-window-focus', dockNotifier.resetDock.bind(dockNotifier));
app.on('activate', dockNotifier.resetDock.bind(dockNotifier));
ipcMain.on('message-received', dockNotifier.messageReceived.bind(dockNotifier));
