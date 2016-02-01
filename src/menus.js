'use strict';

const EventEmitter = require('events').EventEmitter;
const util = require('util');
const _ = require('lodash');


class MenuBuilder {
  constructor(settings) {
    this.appName = settings.appName;
    this.Menu = settings.Menu;
    this.MenuItem = settings.MenuItem;
    this.isDarwin = process.platform === 'darwin';

    this.fileMenu = {
      label: 'File',
      submenu: [
        {
          label: 'Add new account...',
          accelerator: 'CmdOrCtrl+Shift+A',
          id: 'add-account'
        },
        {
          label: 'About ' + this.appName,
          role: 'about'
        },
        {
          type: 'separator'
        },
        {
          label: 'Quit',
          accelerator: 'CmdOrCtrl+Q',
          id: 'quit'
        }
      ]
    };

    this.editMenu = {
      label: 'Edit',
      submenu: [
        {
          label: 'Undo',
          accelerator: 'CmdOrCtrl+Z',
          role: 'undo'
        },
        {
          label: 'Redo',
          accelerator: 'Shift+CmdOrCtrl+Z',
          role: 'redo'
        },
        {
          type: 'separator'
        },
        {
          label: 'Cut',
          accelerator: 'CmdOrCtrl+X',
          role: 'cut'
        },
        {
          label: 'Copy',
          accelerator: 'CmdOrCtrl+C',
          role: 'copy'
        },
        {
          label: 'Paste',
          accelerator: 'CmdOrCtrl+V',
          role: 'paste'
        },
        {
          label: 'Select All',
          accelerator: 'CmdOrCtrl+A',
          role: 'selectall'
        }
      ]
    };

    this.viewMenu = {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          id: 'reload'
        },
        {
          label: 'Toggle Full Screen',
          accelerator: this.isDarwin ? 'Ctrl+Command+F' : 'F11',
          id: 'fullscreen'
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: this.isDarwin ? 'Alt+Command+I' : 'Ctrl+Shift+I',
          id: 'devtools'
        }
      ]
    };

    this.windowMenu = {
      label: 'Window',
      role: 'window',
      submenu: [
        {
          label: 'Minimize',
          accelerator: 'CmdOrCtrl+M',
          role: 'minimize'
        },
        {
          label: 'Close',
          accelerator: 'CmdOrCtrl+W',
          role: 'close'
        },
        {
          type: 'separator'
        }
      ]
    };

    this.darwinAppMenu = {
      label: this.appName,
      submenu: [
        {
          label: 'About ' + this.appName,
          role: 'about'
        },
        {
          label: 'Add new account...',
          accelerator: 'CmdOrCtrl+Shift+A',
          id: 'add-account'
        },
        {
          label: 'Log out',
          id: 'logout'
        },
        {
          type: 'separator'
        },
        {
          label: 'Hide ' + this.appName,
          accelerator: 'Command+H',
          role: 'hide'
        },
        {
          label: 'Hide Others',
          accelerator: 'Command+Shift+H',
          role: 'hideothers'
        },
        {
          label: 'Show All',
          role: 'unhide'
        },
        {
          type: 'separator'
        },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          id: 'quit'
        }
      ]
    };

    this.darwinWindowMenu = _.cloneDeep(this.windowMenu);
    this.darwinWindowMenu.submenu.push(
      {
        type: 'separator'
      },
      {
        label: 'Cycle through windows',
        accelerator: 'Cmd+`',
        id: 'cycle-windows'
      },
      {
        label: 'Bring All to Front',
        role: 'front'
      }
    );

    this.template = this.getTemplate();
  }

  getMenu() {
    return this.Menu.buildFromTemplate(this.template);
  }

  getTemplate() {
    var template = [
      this.fileMenu, this.editMenu, this.viewMenu, this.windowMenu];

    if (this.isDarwin) {
      template = [
        this.darwinAppMenu, this.editMenu, this.viewMenu,
        this.darwinWindowMenu];
    }

    this.bindClickHandlers(template);

    return template;
  }

  bindClickHandlers(template) {
    for (var menuItem of template) {
      for (var subMenuItem of menuItem.submenu) {
        subMenuItem.click = this.menuItemClicked.bind(this);
      }
    }
  }

  logMenuInvocation(menuItem) {
    console.log(
      `"${menuItem.label}" (${menuItem.id || 'no id'}) menu item invoked.`
    );
  }

  menuItemClicked(menuItem, activeWindow) {
    this.logMenuInvocation(menuItem);
    this.emit('menu-item-invoked', menuItem, activeWindow);
    menuItem.id && this.emit(menuItem.id, menuItem, activeWindow);
  }

  accountSelection(menuItem, activeWindow) {
    this.logMenuInvocation(menuItem);
    this.emit('menu-item-invoked', menuItem, activeWindow);
    this.emit('account-selected', menuItem.account);
  }

  createAccountMenuItem(account) {
    let menuItem = new this.MenuItem({
      label: `${account.name} (${account.email})`,
      accelerator: account.accelerator,
      click: this.accountSelection.bind(this)
    });

    menuItem.account = account;

    return menuItem;
  }

  getMenuWithAccounts(accounts) {
    let menu = this.Menu.buildFromTemplate(this.template);
    let menuItems = accounts.map(this.createAccountMenuItem, this);
    let topSeperator = new this.MenuItem({type: 'separator'});
    let bottomSeperator = new this.MenuItem({type: 'separator'});
    let prevAccountMI = new this.MenuItem({
      label: 'Previous account',
      accelerator: 'Shift+CmdOrCtrl+[',
      click: this.menuItemClicked.bind(this)
    });
    let nextAccountMI = new this.MenuItem({
      label: 'Next account',
      accelerator: 'Shift+CmdOrCtrl+]',
      click: this.menuItemClicked.bind(this)
    });

    nextAccountMI.id = 'next-account';
    prevAccountMI.id = 'previous-account';

    if (menuItems.length === 0) {
      return menu;
    }

    menuItems.unshift(topSeperator);
    menuItems.push(bottomSeperator, prevAccountMI, nextAccountMI);

    menuItems.forEach(menuItem => { menu.items[3].submenu.append(menuItem); });

    return menu;
  }
}

util.inherits(MenuBuilder, EventEmitter);

module.exports = MenuBuilder;
