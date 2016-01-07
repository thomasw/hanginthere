'use strict';

const EventEmitter = require('events').EventEmitter;
const util = require('util');
const _ = require('lodash');


class MenuBuilder {
  constructor(settings) {
    this.appName = settings.appName;
    this.Menu = settings.Menu;
    this.isDarwin = process.platform === 'darwin';

    this.fileMenu = {
      label: 'File',
      submenu: [
        {
          label: 'New chat window...',
          accelerator: 'CmdOrCtrl+N',
          id: 'new_window'
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
          accelerator: 'CommandOrCtrl+Q',
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
          id: 'full_screen'
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: this.isDarwin ? 'Alt+Command+I' : 'Ctrl+Shift+I',
          id: 'dev_tools'
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
        }
      ]
    };

    this.darwinAppMenu = {
      label: this.appName,
      submenu: [
        {
          label: 'New chat window...',
          accelerator: 'CmdOrCtrl+N',
          id: 'new_window'
        },
        {
          label: 'About ' + this.appName,
          role: 'about'
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
        label: 'Bring All to Front',
        role: 'front'
      }
    );

    this.template = this.getTemplate();
    this.menu = this.Menu.buildFromTemplate(this.template);
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

  menuItemClicked(menuItem, activeWindow) {
    console.log('"' + menuItem.label + '" menu item invoked.');
    this.emit('menu-item-clicked', menuItem, activeWindow);

    if (menuItem.id) {
      this.emit(menuItem.id + '-clicked', menuItem, activeWindow);
    }
  }
}

util.inherits(MenuBuilder, EventEmitter);

module.exports = MenuBuilder;
