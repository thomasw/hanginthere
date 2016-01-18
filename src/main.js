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


stateLogger();

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
  new LoginWindow().on('account-added', updateAccountData);
}

function init() {
  electron.Menu.setApplicationMenu(menuBuilder.menu);

  mainWindow = new ChatWindow();

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

app.on('before-quit', () => { mainWindow.makeCloseable(); });
app.on('ready', init);
app.on('account-data-update', activateMainWindow);
app.on('window-all-closed', () => {}); // Prevent the default (app closes)

store.subscribe(stateLogger);
store.subscribe(() => {
    if (store.getState().accounts.length === 0) {
      addAccount();
      return;
    }

    if (!mainWindow.isVisible()) {
      activateMainWindow();
    }
});

app.on('browser-window-created', (e, win) => { windowManager.addWindow(win); });
app.on('browser-window-created', (e, win) => { bindWindowEvents(win); });

app.on('browser-window-focus', dockNotifier.resetDock.bind(dockNotifier));
app.on('activate', dockNotifier.resetDock.bind(dockNotifier));
ipcMain.on('message-received', dockNotifier.messageReceived.bind(dockNotifier));
