'use strict';
const electron = require('electron');
const app = electron.app;
const ipcMain = electron.ipcMain;
const session = electron.session;

const createStore = require('redux').createStore;
const actions = require('./actions');
const appReducer = require('./reducers').appReducer;

const store = createStore(appReducer);
const stateLogger = () => {
  console.log('State update:', store.getState());
};

const AccountManager = require('./auth/accounts');
const createLoginWindow = require('./auth/login-window');
const createChatWindow = require('./chat/window');
const WindowManager = require('./window-manager');
const DockNotifier = require('./dock-notifier');

const MenuBuilder = require('./menus');
const bindWindowEvents = require('./window-events');

let mainWindow;
let accountManager = new AccountManager();
let windowManager = new WindowManager();
let dockNotifier = new DockNotifier({dock: app.dock});
let menuBuilder = new MenuBuilder({
  appName: app.getName(),
  Menu: electron.Menu,
  MenuItem: electron.MenuItem
});


stateLogger();

function notifyMainOnAccountSelection(account) {
  mainWindow.show();
  mainWindow.webContents.send('account-selection', account);
}

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
  return accountManager.getAccounts()
    .then(actions.updateAccounts)
    .then(store.dispatch);
}

function activateMainWindow() {
  mainWindow.show();
  mainWindow.focus();
}

function addAccount() {
  createLoginWindow().on('account-added', updateAccountData);
}

function init() {
  electron.Menu.setApplicationMenu(menuBuilder.getMenu());

  mainWindow = createChatWindow();

  updateAccountData().catch((error) => {
    console.log('Unable to retrieve account data.', error);
    app.quit();
  });
}

function appReset() {
  session.defaultSession.clearStorageData(()=>{
    store.dispatch(actions.reset());

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
menuBuilder.on('account-selected', notifyMainOnAccountSelection);
menuBuilder.on('next-account', () => {
  mainWindow.show();
  mainWindow.webContents.send('next-account');
});
menuBuilder.on('previous-account', () => {
    mainWindow.show();
    mainWindow.webContents.send('previous-account');
});

app.on('before-quit', () => { mainWindow.makeCloseable(); });
app.on('ready', init);
app.on('account-data-update', activateMainWindow);
app.on('window-all-closed', () => {}); // Prevent the default (app closes)

store.subscribe(stateLogger);
store.subscribe(() => {
    let accounts = store.getState().accounts;

    if (accounts.length === 0) {
      addAccount();
      return;
    }

    if (!mainWindow.isVisible()) {
      activateMainWindow();
    }

    electron.Menu.setApplicationMenu(menuBuilder.getMenuWithAccounts(accounts));

    mainWindow.webContents.send('accounts-update', accounts);
});

app.on('browser-window-created', (e, win) => { windowManager.addWindow(win); });
app.on('browser-window-created', (e, win) => { bindWindowEvents(win); });

ipcMain.on('update-dock-count', dockNotifier.dockAlert.bind(dockNotifier));
ipcMain.on('add-account', addAccount);
ipcMain.on('request-accounts', (e) => {
  e.sender.send('accounts-update', store.getState().accounts);
});
