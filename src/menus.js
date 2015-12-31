'use strict';

const electron = require('electron');
const _ = require('lodash');

var appName = electron.app.getName();

var fileMenu = {
  label: 'File',
  submenu: [
    {
      label: 'New chat window...',
      accelerator: 'CmdOrCtrl+N',
      click: function() { console.log("Attempted to open new window...."); }
    },
    {
      label: 'About ' + appName,
      role: 'about'
    },
    {
      type: 'separator'
    },
    {
      label: 'Quit',
      accelerator: 'CommandOrCtrl+Q',
      click: function() { electron.app.quit(); }
    },
  ]
}

var editMenu = {
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
    },
  ]
}

var viewMenu = {
  label: 'View',
  submenu: [
    {
      label: 'Reload',
      accelerator: 'CmdOrCtrl+R',
      click: function(item, focusedWindow) {
        if (focusedWindow)
          focusedWindow.reload();
      }
    },
    {
      label: 'Toggle Full Screen',
      accelerator: process.platform == 'darwin' ? 'Ctrl+Command+F' : 'F11',
      click: function(item, focusedWindow) {
        if (focusedWindow) {
          focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
        }
      }
    },
    {
      label: 'Toggle Developer Tools',
      accelerator: process.platform == 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
      click: function(item, focusedWindow) {
        if (focusedWindow) {
          focusedWindow.toggleDevTools();
        }
      }
    },
  ]
}

var windowMenu = {
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
  ]
}

var darwinAppMenu = {
  label: appName,
  submenu: [
    {
      label: 'New chat window...',
      accelerator: 'CmdOrCtrl+N',
      click: function() { console.log("Attempted to open new window...."); }
    },
    {
      label: 'About ' + appName,
      role: 'about'
    },
    {
      type: 'separator'
    },
    {
      label: 'Hide ' + appName,
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
      click: function() { electron.app.quit(); }
    },
  ]
}

var darwinWindowMenu = _.cloneDeep(windowMenu);
darwinWindowMenu.submenu.push([
  {
    type: 'separator'
  },
  {
    label: 'Bring All to Front',
    role: 'front'
  }
]);

var template = [fileMenu, editMenu, viewMenu, windowMenu];

if (process.platform === 'darwin') {
  var template = [darwinAppMenu, editMenu, viewMenu, darwinWindowMenu]
}

class MenuBuilder {
  constructor(settings) {
    this.template = template;
    this.menu = settings.menu;
  }

  build_menu() {
    console.log("Menu template:", this.menu.buildFromTemplate(this.template));
    return this.menu.buildFromTemplate(this.template);
  }

}

module.exports = MenuBuilder;
